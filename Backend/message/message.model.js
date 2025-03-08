const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text: {
        type: String
    },
    imageUrl: {
        type: String,
        required:false
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    room: {
        type: String,
        ref: 'chatroom',
        required: true
    },
    sentAt: {
        type: String,
        default: Date.now,
        required: true
    }
})

const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel;