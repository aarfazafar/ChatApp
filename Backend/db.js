const mongoose = require('mongoose');
const MONGO_URL = "mongodb+srv://tanweerjamal833:oSE9g7oLTUBlsrjV@letschat.0z1pv.mongodb.net/user";
function connectToDB () {
    mongoose.connect(MONGO_URL).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });
}
module.exports = connectToDB;