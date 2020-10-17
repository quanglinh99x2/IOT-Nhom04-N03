var express = require("express");
var app = express();

app.use(express.static("public"));
app.use(express.static(__dirname));
//server
app.set("view engine","ejs");
app.set("views","./views");

var server=require("http").Server(app);
var io= require("socket.io")(server);
server.listen(process.env.PORT || 80);


io.on('connection', function (socket) {
  // var msg = '{"LED":"on"}';
  // var obj = JSON.parse(msg);
  console.log('1 user connected -socket id: '+socket.id);
  // console.log(obj);
  // socket.broadcast.emit('message',msg);
  socket.on('disconnect', function () {
    console.log('user disconnected  -socket id: '+socket.id);
  });
  //SERVER nhận tín hiệu điều khiển
  socket.on('message', function (msg) {
    console.log("message: "+msg.message);
    console.log("send to socket: "+msg.socketID);
    var obj  = JSON.parse(msg.message);
    
    io.to(msg.socketID).emit("message",obj);
  });
  // server nhận yêu cầu kết nối led lên client
  socket.on('res_connect_led', function (data) {
    console.log(data);
    var obj =JSON.parse(data);
    socket.broadcast.emit("res_led_connect",obj); // gửi yêu cầu cho tất cả, nếu nó là esp nó sẽ trả về :ok_connect
}); 
// nhận oke kết nối esp rồi trả về cho tất cả client
socket.on('ok_connect', function (data) {
    console.log("Số lượng đèn :",data);
    var count = parseInt(data);
    // console.log("count: ",count);
    socket.broadcast.emit("add_led_control",{socketId:socket.id,count:count});
}); 
socket.on('ok_connect_name', function (data) {
  console.log("Thông tin ESP8266 :",data);

  // console.log("count: ",count);
  socket.broadcast.emit("add_name_room",data);
}); 

});

app.get("/",function(rep,res){
    res.render("index");
});