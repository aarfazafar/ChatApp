const express = require('express');
const router = express.Router();
const messageControl = require('./message.control');
const { body } = require('express-validator');
const authMiddleware = require('../user/user.middleware');

router.post('/send', [
    authMiddleware.authUser, 
    body('roomId').isString().notEmpty().withMessage('Room ID is required'),
    body('content').isString().notEmpty().withMessage('Message content is required'),
], messageControl.sendMessage);

router.get('/:roomId', authMiddleware.authUser, messageControl.getMessages);

module.exports = router;
