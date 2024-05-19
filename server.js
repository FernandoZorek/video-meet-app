const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , { debug:true });

app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req,res) => res.render('index' , {RoomId: uuidv4()}));

app.get('/:room', (req,res) => res.render('class' , {RoomId: req.params.room}));

io.on("connection", (socket) =>{
  socket.on('newUser' , (id , room)=>{
    console.log("Start room: " + room + ", user: ", id);
    socket.join(room);
    socket.to(room).emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
      console.log("userDisconnect: ", id);
      socket.to(room).emit('userDisconnect' , id);
    })
  })
})

server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})