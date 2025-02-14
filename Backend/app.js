const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dotenv = require('dotenv');   
dotenv.config();
const port = process.env.PORT || 3000;

const userRoute = require('./user/user.routes');
app.use('/user', userRoute);
app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(3000, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;