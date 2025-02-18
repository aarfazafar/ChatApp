const port = process.env.PORT || 3000;
const app = require("./app");
const { Server } = require("socket.io");
const { createServer } = require("http");

const cors = require("cors");
const messageModel = require("./message/message.model");
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

  socket.on("message", async ({ message, sentBy, id, timestamp }) => {
    if (!id || !message || !sentBy) {
      console.log({id, message, sentBy});
      console.error("Missing required fields: room, message, sentBy");
      return;
    }

    const newMessage = new messageModel({
      text: message,
      sentBy: sentBy,
      room: id,
      sentAt: timestamp
    })
    await newMessage.save();
    console.log(`Message received in room ${id}: ${message}`);
    if (id) {
      io.to(id).emit("received", newMessage); 
    } else {
      io.emit("received", newMessage);
    }
  });

  socket.on("join-room", async (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room: ${roomID}`);

    const messages = await messageModel.find({ room: roomID }).sort("sentAt");
    socket.emit("previous-messages", messages);
    socket.to(roomID).emit("Welcome", `User ${socket.id} joined the room`);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


