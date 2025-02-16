const port = process.env.PORT || 3000;
const app = require('./app');
const { Server } = require("socket.io");
const { createServer } = require('http');

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
    console.log("User connected");
    console.log("Id", socket.id);

    socket.on("disconnect",() => {
        console.log("User disconnected", socket.id)
    })

    socket.on("message", (data) => {
        console.log(data);
        io.emit("recieved", data);
    })
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


