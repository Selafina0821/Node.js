var mqtt = require('mqtt');
var opt = {
  port:1883,
  clientId: 'nodejs'
};
var io = require("socket.io");
var express = require("express");
var app = express();
app.use(express.static('www'));
var server = app.listen(5438);

var client  = mqtt.connect('mqtt://120.126.16.88',opt);
var sio = io(server);

client.on('connect', function () {
  console.log('已連接至MQTT伺服器');
  client.subscribe("nodejs");
});

sio.on('connection', function(socket){
  client.on('message', function (topic, msg) { 
      console.log('收到 ' + topic + ' 主題，訊息：' + msg.toString());
      socket.emit('mqtt', { 'msg': msg.toString() });
  });
});