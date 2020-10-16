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
  console.log('user connected');
  // console.log(obj);
  // socket.broadcast.emit('message',msg);
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('message', function (msg) {
    console.log("message: "+msg);
    var obj  = JSON.parse(msg);
    console.log("obj: "+obj);
    socket.broadcast.emit('message',obj);
  });
  
});

app.get("/",function(rep,res){
    res.render("index");
});