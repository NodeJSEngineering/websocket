const express = require("express");
const socket = require("socket.io");

const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
// Static files - upload frontend build here
app.use(express.static("public"));

const io = socket(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
})

const activeUsers = new Set();

// socket.on('connect', () => {}) // This event is fired by the Socket instance upon connection and reconnection By default, any event emitted while the Socket is not connected will be buffered until reconnection. While useful in most cases (when the reconnection delay is short), it could result in a huge spike of events when the connection is restored. to solve this Offline behavior clear buffer using sendBuffer property socket.sendBuffer = [] then you can receive and sendMessage
io.on("connection", (socket) => {
  console.log(socket.id, 'socket.id'); // x8WIv7-mJelg7on_ALbx // // server-side Each new connection is assigned a random 20-characters identifier.
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    console.log(data, 'new user FROM client');

    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  // socket.on("disconnect", (reason) => {}) here if the disconnection was initiated by the server, you can reconnect manually here
// socket.on("connect_error", () => {}) fired when the connection is denied by the server in a middleware function here you can modify the auth attribute
  socket.on("disconnect", () => {

    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("chat message", function (data) {
    console.log(data, 'chat FROM client');

    io.emit("chat message", data);
  });

  socket.on("typing", function (data) {
    console.log(data, 'typing FROM client');

    socket.broadcast.emit("typing", data);
  });

  socket.on('join', function (data) {
    console.log(data, 'join FROM client');

    // event emit name, text message
    socket.emit('messages', 'Hello from server');
  });


});
