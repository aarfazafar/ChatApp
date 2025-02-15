const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');   
dotenv.config();
const port = process.env.PORT || 3000;

const userRoute = require('./user/user.routes');
app.use('/user', userRoute);

const connectToDB = require('./db');
connectToDB();

app.get('/', (req, res) => {
    res.send('Hello');
});

module.exports = app;