const userService = require('./user.service');
const { validationResult } = require('express-validator');
const userModel = require('./user.model');
const tokenBlacklistModel = require('./tokenBlacklist.model');

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password, age} = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createdUser({
        first: name.first,
        last: name.last,
        email,
        password: hashedPassword,
        age,
    });

    const token = await user.generateAuthToken();
    user.save();
    res.status(200).json({user, token});
};

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    const user = await userModel.findOne({ email }).select('+password');

    if(!user) {
        return res.status(404).send('User not found');
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch) {
        return res.status(400).send('Invalid credentials');
    }

    const token = await user.generateAuthToken();

    res.cookie('token', token);
    res.status(200).json({user, token});  
};

module.exports.logoutUser = async (req, res) => {
    const token = req.cookies.token || req.header.authorization;
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    const blacklistToken = await tokenBlacklistModel.findOne({ token: token });
    if(blacklistToken) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    res.clearCookie('token');
    await tokenBlacklistModel.create({ token: token });
    res.status(200).json({ message: 'Logout successful' });
};

module.exports.getProfile = async (req, res) => {
    res.status(200).json(req.user);
};