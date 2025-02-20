const express = require('express');
const router = express.Router();
const userControl = require('./user.control');
const {body} = require('express-validator');
const authMiddleware = require('./user.middleware');

router.post('/register', [
    body('name.first').isString().notEmpty().withMessage('First name is required'),
    body('name.last').isString().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
    body('age').isNumeric().notEmpty().withMessage('Age is required'),
], userControl.registerUser);

router.post('/login', [
    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
], userControl.loginUser);

router.get('/logout', authMiddleware.authUser, userControl.logoutUser);

router.get('/profile', authMiddleware.authUser, userControl.getProfile);

router.put('/change-username', authMiddleware.authUser, userControl.changeUsername);

module.exports = router;

