const mongoose = require('mongoose');

const blacklistSchema = mongoose.Schema({
    token: {
        type: String,
        required: true, 
        unique: true,
    },
    expires: {
        type: Date,
        default: Date.now,
        expires: 86400,
    },
});

module.exports = mongoose.model('blacklist', blacklistSchema);