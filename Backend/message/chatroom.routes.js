const express = require('express');
const router = express.Router();
const chatroomControl = require('./chatroom.control');
const { body } = require('express-validator');
const authMiddleware = require('../user/user.middleware');

router.post('/create', [
    authMiddleware.authUser,
    body('name').isString().notEmpty().withMessage('Chatroom name is required'),
], chatroomControl.createChatroom);

router.post('/join', [
    authMiddleware.authUser,
    body('roomId').isString().notEmpty().withMessage('Room ID is required'),
], chatroomControl.joinChatroom);

router.post('/leave', [
    authMiddleware.authUser,
    body('roomId').isString().notEmpty().withMessage('Room ID is required'),
    body('userId').isString().notEmpty().withMessage('User ID is required'),
], chatroomControl.leaveRoom);

router.get('/room',authMiddleware.authUser, chatroomControl.getRoomInfo)

router.get('/allRooms', chatroomControl.getRooms);

module.exports = router;
