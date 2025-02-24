const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
const FRONTEND = process.env.VITE_FRONTEND_URL;
app.use(cors({
    origin: FRONTEND,
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