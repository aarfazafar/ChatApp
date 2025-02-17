const port = process.env.PORT || 3000;
const app = require("./app");
const { Server } = require("socket.io");
const { createServer } = require("http");

const cors = require("cors");
app.use(cors());

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

  // socket.emit("welcome", `Welcome to the server ${socket.id}`);
  // socket.broadcast.emit("welcome", `${socket.id} joined the server`);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("message", ({ message, id }) => {
    console.log(message, id);
    if (id) {
      io.to(id).emit("received", message);
    } else {
      io.emit("received", message);
    }
  });

  socket.on("join-room", (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room: ${roomID}`);
    socket.to(roomID).emit("welcome", `User ${socket.id} joined the room`);
  });
  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
