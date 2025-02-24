const port = process.env.PORT || 3000;
const app = require("./app");
const { Server } = require("socket.io");
const { createServer } = require("http");
const FRONTEND = process.env.VITE_FRONTEND_URL  || "http://localhost:5173";

const cors = require("cors");
const messageModel = require("./message/message.model");
app.use(
  cors({
    origin:FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
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
      console.log({ id, message, sentBy });
      console.error("Missing required fields: room, message, sentBy");
      return;
    }

    const newMessage = new messageModel({
      text: message,
      sentBy: sentBy,
      room: id,
      sentAt: timestamp,
    });
    const savedMessage = await newMessage.save();
    await savedMessage.populate("sentBy", "username");
    console.log(
      `Message received in room ${id}: ${message} - by sender ${sentBy?.username}`
    );
    io.to(id).emit("received", savedMessage);
  });

  socket.on("join-room", async (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room: ${roomID}`);

    const messages = await messageModel.find({ room: roomID }).sort("sentAt");
    // console.log(messages)
    socket.emit("previous-messages", messages);
    socket.to(roomID).emit("Welcome", `User ${socket.id} joined the room`);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("delete-message", async (chatid) => {
    try {
      console.log(`Message ${chatid} deleted`);
    } catch (error) {
      console.log("Error deleting message:", error);
    }
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
