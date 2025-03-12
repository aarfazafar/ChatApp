const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        // isAdmin: {
        //     type: Boolean,
        // },
        ref: 'user',
    }],
    admin: {
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tags: {
        type: [{type: String}],
    },
    icon:{
        type: String,
    }
});

const chatroomModel = mongoose.model('chatroom', chatroomSchema);
module.exports = chatroomModel;
