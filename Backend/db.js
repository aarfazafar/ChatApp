const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;
function connectToDB () {
    mongoose.connect(MONGO_URL).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });
}
module.exports = connectToDB;