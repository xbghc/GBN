var event_flag = false;

function apply_event_flag()
{
    while(event_flag){
        setTimeout(100);
    }
    event_flag = true;
}

function release_event_flag()
{
    event_flag = false;
}

// 分组抵达
var event_packet_arrive = new CustomEvent("packet_arrive", {
    detail: {
        key_number: null,
        sequence_number: null,
        data: null
    }
});

// 分组出发
var event_packet_sended = new CustomEvent("new_packet_sended", {
    detail: {
        key_number: null,
        sequence_number: null,
        data: null
    }
});

// 分组丢失
var event_packet_loss = new CustomEvent("packet_loss", {
    detail: {
        key_number: null,
        sequence_number: null,
        data: null
    }
});

// 分组移动
var event_packet_move = new CustomEvent("packet_move",{
    detail: null
});

// 传输结束
var event_finish = new CustomEvent("finish", {
    detail: {
        key_number: null,
        sequence_number: null,
        data: null
    }
});



