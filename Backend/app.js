const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
const FRONTEND = process.env.VITE_FRONTEND_URL;
const FRONTEND2 = process.env.VITE_FRONTEND_URL2;
app.use(cors({
    origin: [FRONTEND,FRONTEND2, "http://localhost:5173"],
    credentials: true
}));

const dotenv = require('dotenv');   
dotenv.config();
const port = process.env.PORT || 3000;

const userRoute = require('./user/user.routes');
app.use('/user', userRoute);

//chat and message routes
const chatroomRoutes = require("./message/chatroom.routes");
const messageRoutes = require("./message/message.routes");

app.use("/chatrooms", chatroomRoutes);
app.use("/messages", messageRoutes);

const connectToDB = require('./db');
connectToDB();

app.get('/', (req, res) => {
    res.send('Hello');
});

module.exports = app;