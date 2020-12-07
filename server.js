const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.set('views', "./views")
app.set('view engine', 'ejs')
app.use("/public", express.static('public'))
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.render('nickname')
})

var online = []
app.post('/chat', (req, res) => {
  online.push(req.body.nickname)
  res.render('chat',{name:req.body.nickname})
});
const users = {}

io.on('connection', (socket) => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', { name: users[socket.id], online: [...online] })
  })

  socket.on('onlines', ()=>{
    io.emit('onlines',{nicknames:[...online]})
  })

  socket.on('user-typing', name => {
    socket.broadcast.emit('user-typing', name)
  })

  socket.on('untyping', () => {
    socket.broadcast.emit('untyping')
  })

  socket.on('chat message', (message) => {
    socket.broadcast.emit('chat message', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    online.splice(online.indexOf(users[socket.id]),1)
    socket.broadcast.emit('user-disconnected', { user: users[socket.id], online: [...online] });
    delete users[socket.id]
  });
});

http.listen(port, () => { console.log(`Listening at port ${port}`) })