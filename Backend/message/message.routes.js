const express = require('express');
const router = express.Router();
const messageControl = require('./message.control');
const { body } = require('express-validator');
const authMiddleware = require('../user/user.middleware');
const mongoose = require("mongoose");


router.post('/send', [
    authMiddleware.authUser,
    body('text').isString().notEmpty().withMessage('Message content is required'),
    body('sentBy')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid sender ID'),
    body('room').isString().notEmpty().withMessage('Room ID is required'),
    body('sentAt').isString().notEmpty().withMessage('Timeline needed')
], messageControl.sendMessage);

router.get('/:roomId', authMiddleware.authUser, messageControl.getMessages);
router.post('/delete-message', authMiddleware.authUser,body('id').isString().notEmpty().withMessage('Chat ID is required'), messageControl.deleteMessage);

module.exports = router;
