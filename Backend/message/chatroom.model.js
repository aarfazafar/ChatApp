const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const chatroomModel = mongoose.model('chatroom', chatroomSchema);
module.exports = chatroomModel;
