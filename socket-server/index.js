// https://socket.io/get-started/chat#serving-html

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

//socket
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
 res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);

  socket.broadcast.emit('hi');
  
  // socket.on('chat message', (msg) => {
  //   console.log('message: ' + msg);
  //   io.emit('chat message', msg);
  // });

  socket.on('UP BUTTON', (touch) => {
    console.log(touch)
    io.emit('UP BUTTON', touch)
  });

  socket.on('RIGHT BUTTON', (touch) => {
    console.log(touch)
    io.emit('RIGHT BUTTON', touch)
  });

  socket.on('LEFT BUTTON', (touch) => {
    console.log(touch)
    io.emit('LEFT BUTTON', touch)
  });

  socket.on('DOWN BUTTON', (touch) => {
    console.log(touch)
    io.emit('DOWN BUTTON', touch)
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});