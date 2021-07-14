const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
var mqtt = require('mqtt');
var opt = {
  port:1883,
};
var client  = mqtt.connect('mqtt://120.126.16.88',opt);
client.on('connect', function () {
  console.log('已連接至MQTT伺服器');
  client.subscribe("nodejs");
});
client.on('message', function (topic, msg) { 
    console.log('收到 ' + topic + ' 主題，訊息：' + msg.toString());
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('front-end connected');
  socket.emit('mqtt',  msg.toString() );
});
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});
