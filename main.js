function init(packetNum, windowSize) {
    begin(packetNum, windowSize);
    init_canvas(packetNum);
}
init(10, 3);


function start() {
    setInterval(function () {
        update_packet();
        draw_scene();
    }, 10);
    document.getElementById("start").onclick = keep_on;
}


function remove() {
    if (!pause_time) {
        return;
    }
    let canvas = document.getElementById("main_canvas");
    canvas.style.cursor = "hand";
    canvas.onclick = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        for (let i = 0; i < sending_confirm_packets.length; i++) {
            let packet = sending_confirm_packets[i];
            let left = 10 + 40 * packet.sequence_number;
            let top = 610 - packet.position * 600 / total_distance;
            if (x > left && x < left + 30 && y > top && y < top + 30) {
                delete_confirm_packet(packet.key_number);
                canvas.onclick = null;
                canvas.style.cursor = "";
                return;
            }
        }
        for (let i = 0; i < sending_data_packets.length; i++) {
            let packet = sending_data_packets[i];
            let left = 10 + 40 * packet.sequence_number;
            let top = 10 + packet.position * 600 / total_distance;
            if (x > left && x < left + 30 && y > top && y < top + 30) {
                delete_data_packet(packet.key_number);
                canvas.style.cursor = "";
                canvas.onclick = null;
                return;
            }
        }
    }
}


function init_canvas(group_numbers) {
    set_color(255, 255, 0);
    set_background_color(0, 0.25, 0.25);
    clear_canvas();
    for (let i = 0; i < group_numbers; i++) {
        draw_rectangle(10 + 40 * i, 10, 40 + 40 * i, 40);
    }
}

function draw_scene() {
    clear_canvas();
    let i = 0;
    // 已传输分组
    for (i = 0; i <= last_confirm_number; i++) {
        draw_confrim_packet(i);
    }

    // 未确认分组
    for(;i<=last_sended_number;i++){
        draw_sended_packet(i);
    }
    draw_sending_data_packet();
    draw_sending_confirm_packet();

    // 未发送分组
    for (i = last_sended_number + 1; i < packetNum; i++) {
        draw_unsended_packet(i);
    }

    function draw_confrim_packet(i) {
        set_color(255, 0, 0);
        draw_rectangle(10 + 40 * i, 10, 40 + 40 * i, 40);
    }

    function draw_sended_packet(i){
        set_color(128,128,0);
        draw_rectangle(10 + 40 * i, 10, 40 + 40 * i, 40);
    }

    function draw_sending_data_packet() {
        set_color(0, 255, 0);
        for (let i = 0; i < sending_data_packets.length; i++) {
            let packet = sending_data_packets[i];
            let x = 10 + 40 * packet.sequence_number;
            let y = 10 + 600 * packet.position / total_distance;
            draw_rectangle(x, y, x + 30, y + 30);
        }
    }

    function draw_sending_confirm_packet() {
        set_color(0, 0, 255);
        for (let i = 0; i < sending_confirm_packets.length; i++) {
            let packet = sending_confirm_packets[i];
            let x = 10 + 40 * packet.sequence_number;
            let y = 610 - 600 * (packet.position / total_distance);
            draw_rectangle(x, y, x + 30, y + 30);
        }
    }

    function draw_unsended_packet(i) {
        set_color(255, 255, 0);
        draw_rectangle(10 + 40 * i, 10, 40 + 40 * i, 40);
    }
}