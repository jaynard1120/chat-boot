// const app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// app.get('/chat', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });
// var count = 0;
// var online = []
// const users = {}

//   io.on('connection', (socket) => {
//     socket.on('new-user',name =>{ 
//       users[socket.id] = name;
//       online.push(name)
//       console.log(online)
//       socket.broadcast.emit('user-connected',{name:name,online:[...online]})
//     })

//     socket.on('user-typing',name=>{
//       socket.broadcast.emit('user-typing',name)
//     })

//     socket.on('untyping',()=>{
//       socket.broadcast.emit('untyping')
//     })

//     socket.on('chat message', (message) => {
//       socket.broadcast.emit('chat message', {message:message, name:users[socket.id]});
//     });

//     socket.on('disconnect', () => {
//       online.splice(online.indexOf(users[socket.id]))
//       socket.broadcast.emit('user-disconnected', {user:users[socket.id],online:[...online]});
//       delete users[socket.id]
//     });
//   });

// http.listen(3000,()=>{console.log("Listening at port 8000")})