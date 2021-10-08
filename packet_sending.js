total_distance = 500; // 距离
sending_data_packets = []; // 传输中的数据分组
sending_confirm_packets = []; // 传输中的确认分组

key_counter = 0; // 用于标识唯一的分组，每创建一个该值加1

unreceived_number = 0;
last_sended_number = -1;
last_confirm_number = -1;

clocks = [];
pause_time = null; // 暂停开始时间，如果当前没暂停则为null
timeout = 5000; // 超时时间

default_speed = 500;

// 开始
function begin(num, size) {
    packetNum = num;
    windowSize = size;
    send_new_packets();
}


// 暂停
function pause() {
    if(pause_time){
        return;
    }
    pause_time = new Date().getTime();
}

// 继续
function keep_on() {
    if(!pause_time){
        return;
    }
    pause_time = null;
}


// 发送数据分组，开始计时
function send_data_packet(sequence_number) {
    let packet = {
        key_number: key_counter,
        sequence_number: sequence_number,
        data: true,
        position: 0,
        speed: default_speed
    };
    key_counter++;
    sending_data_packets.push(packet);
    clocks[sequence_number] = timeout;

    apply_event_flag();
    event_packet_sended.detail = packet;
    // document.dispatchEvent("new_packet_sended");
    document.dispatchEvent(event_packet_sended);
    release_event_flag();
}


// 发送确认分组
function send_confirm_packet(sequence_number) {
    let packet = {
        key_number: key_counter,
        sequence_number: sequence_number,
        data: false,
        position: 0,
        speed: default_speed
    };
    key_counter++;
    sending_confirm_packets.push(packet);

    apply_event_flag();
    event_packet_sended.detail = packet;
    document.dispatchEvent(event_packet_sended);
    release_event_flag();
}


// 数据分组到达
function data_packet_arrive(packet) {
    if (packet.sequence_number == unreceived_number) {
        unreceived_number++;
        send_confirm_packet(packet.sequence_number);
    }

    apply_event_flag();
    event_packet_arrive.detail = packet;
    document.dispatchEvent(event_packet_arrive);
    release_event_flag();

}

// 确认分组到达
function confirm_packet_arrive(packet) {
    if (last_confirm_number < packet.sequence_number) last_confirm_number = packet.sequence_number;
    clocks[packet.sequence_number] = null;

    apply_event_flag();
    event_packet_arrive.detail = packet
    document.dispatchEvent(event_packet_arrive);
    release_event_flag();

    send_new_packets();
}

// 删除确认分组
function delete_confirm_packet(key_number) {
    for (let i = 0; i < sending_confirm_packets.length; i++) {
        let packet = sending_confirm_packets[i];
        if (packet.key_number == key_number) {
            sending_confirm_packets.splice(i, 1);
            return;
        }
    }
}

// 删除数据分组
function delete_data_packet(key_number) {
    for (let i = 0; i < sending_data_packets.length; i++) {
        let packet = sending_data_packets[i];
        if (packet.key_number == key_number) {
            sending_data_packets.splice(i, 1);
            return;
        }
    }
}

// 发送方尽可能发送分组
function send_new_packets() {
    for (let i = last_sended_number+1; i<packetNum && i - last_confirm_number <= windowSize; i++) {
        send_data_packet(i);
        last_sended_number++;
    }
}

// 设置分组速度
function set_speed(packet, speed) {
    packet.speed = speed;
}

last_update_time = null;
// 更新位置
function update_packet() {
    if (!last_update_time || pause_time) {
        last_update_time = new Date().getTime();
        return;
    }
    
    // 更新位置
    let now = new Date().getTime();
    let seconds = (now - last_update_time) / 1000;
    for(let i=0;i<sending_data_packets.length;i++){
        sending_data_packets[i].position += sending_data_packets[i].speed * seconds;
    }
    for(let i=0;i<sending_confirm_packets.length;i++){
        sending_confirm_packets[i].position += sending_confirm_packets[i].speed * seconds;
    }

    // 处理已到达的分组
    for(let i=0;i<sending_data_packets.length;i++){
        let packet = sending_data_packets[i];
        if(packet.position >= total_distance){
            data_packet_arrive(packet);
            sending_data_packets.splice(i,1);
            delete packet;
            i--;
        }
    }
    for(let i=0;i<sending_confirm_packets.length;i++){
        let packet = sending_confirm_packets[i];
        if(packet.position >= total_distance){
            confirm_packet_arrive(packet);
            sending_confirm_packets.splice(i,1);
            delete packet;
            i--;
        }
    }

    // 处理超时
    for(let i=0;i<packetNum;i++){
        let clock = clocks[i];
        if(clock == null){
            continue;
        }
        clocks[i] -= now - last_update_time;
        if(clocks[i]<0){
            send_data_packet(i);
        }
    }
    last_update_time = now;
}

// 分组移动
function move_packet(packet) {
    let speed = speeds[packet.key_number];
    if (speed) {
        packet.position += speed;
    } else {
        packet.position += 500;
    }

    apply_event_flag();
    event_packet_sended.detail = {
        ...packet,
        ...{
            speed: speed
        }
    };
    document.dispatchEvent(event_packet_move);
    release_event_flag();
}