
## 事件

我第一次写事件驱动型的结构，所以把事件的定义放在了单独文件中

可以直接看`event.js`文件，然后跳过本节


定义了以下事件:
- `packet_arrive`：分组到达
- `new_packet_sended`：生成新的分组
- `packet_loss`：分组丢失
- `packet_move`：分组移动
- `finish`：传输结束


## 介绍

### packet

pakcet中有5个成员:

- `sequence_number`：分组的序号
- `key_number`：分组的标识符
- `data`：`true`指数据分组, `false`指确认分组
- `position`：分组所走过的路程
- `speed`：分组传输的速度

### 分组传输

程序固定了发送到到接受方的距离：5000

当`packet.position >= 5000`表示分组到达目的地

### 超时时间

默认为5000ms，保存在变量`timeout`中

## 接口

### pause() & keep_on()

暂停和继续

### set_speed(packet)

设置分组的速度，默认为500

### move_packet(packet)

分组的所走过的路程 += 速度

