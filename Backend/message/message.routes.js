const express = require('express');
const router = express.Router();
const messageControl = require('./message.control');
const { body } = require('express-validator');
const authMiddleware = require('../user/user.middleware');

router.post('/send', [
    authMiddleware.authUser,
    body('text').isString().notEmpty().withMessage('Message content is required'),
    body('room').isString().notEmpty().withMessage('Room ID is required'),
], messageControl.sendMessage);

router.get('/:roomId', authMiddleware.authUser, messageControl.getMessages);

module.exports = router;
