let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);

users = [];
connections = [];
console.log('websocketSuccess');

server.listen(process.env.PORT || 3000);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


//io
io.sockets.on('connection', function(socket){
  connections.push(socket)
  //接続成功の場合 接続個数を表示
  console.log('Connected: %s sockets connected', connections.length);

  //disconnect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('disconnected: %s sockets connected', connections.length);
    console.log(data);
  });

  //send message
  socket.on('send message', function(data){
    // if(!socket.username) return;
    console.log('server.js:send message');
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    // console.log(data);//index.htmlと連携が取られてチャットメッセージがリアルタイムにbashに反映
    io.sockets.emit('new message', {msg: data, user:socket.username});
  });

  //new user
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    console.log('updateUsernames');
    io.sockets.emit('get users', users);
  }
});
