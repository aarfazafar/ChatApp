const express = require('express');
const router = express.Router();
const userControl = require('./user.control');
const {body} = require('express-validator');

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

module.exports = router;