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
    },
    expiryDuration: { // in seconds 
        type: Number,
        default: 86400, // default = 24h
    },
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 86400 * 1000); // 24h default
        },
        index: { expireAfterSeconds: 0 } // TTL index → Mongo auto-deletes room
    }
});

const chatroomModel = mongoose.model('chatroom', chatroomSchema);
module.exports = chatroomModel;
