const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
var mqtt = require('mqtt');
var opt = {port:1883,};
const client  = mqtt.connect('mqtt://120.126.18.104',opt);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://120.126.18.104:27017/";

var username 
var useremail
var str

// Functions
function getDatetime(){
  let date_ob = new Date();

  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date in YYYY-MM-DD format
  //console.log(year + "-" + month + "-" + date);

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  let result = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
  
  // prints time in HH:MM format
  //console.log(hours + ":" + minutes);

  return result
}

client.on('connect', function () {
  console.log('已連接至MQTT伺服器');
  client.subscribe("nodejs");
  
  
});

client.on('message', function (_, msg) { 
  console.log( getDatetime() + " >> "+ msg.toString());
  // store msg to redis database
  io.sockets.emit('mqtt', msg.toString()); // to all socket clients
});
client.on('message', (_, msg) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
  
    var dbo = db.db("test");
  
    var myobj ={ recv_time: "recv_time", value: (msg.toString()) };
  
    dbo.collection("test_nodejs").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  }); 
    console.log( getDatetime() + " >> "+ msg.toString());
    // store msg to redis database
    io.sockets.emit('wifi', msg.toString()); // to all socket clients
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  console.log('client已連接');
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/', function(request, response){
     username =request.body.user.name;
     useremail =request.body.user.email;
     str ={'name':username,'email':useremail}
    var strToObj=JSON.stringify({'name':username,'email':useremail});
    console.log(username);
    console.log(useremail);
    client.publish('web',"'"+strToObj+"'");
});

  


      
    
//var testInput = document.getElementById("testInput");
//var submitBtn = document.querySelector(".submitBtn");
//function FsubmitBtn(value) {
//  var str = "";
//  var submitValue = testInput.value;
//  str = submitValue;
//  alert(str);
//  console.log(str);
//}
//submitBtn.addEventListener("click", FsubmitBtn);


//app.post('/test3', function(req, res) {
//  console.log('app success')
  
//  console.log(req.params.name);
//});

//io.on('connection', (socket) => {
// console.log('front-end connected');
//  socket.emit('mqtt',  msg.toString() );
  
//});
//io.on('web_data', function(data) {
//    console.log("web_msg")
//    process.stdout.write(data.letter);
//  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});


