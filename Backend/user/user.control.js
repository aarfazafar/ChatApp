const userService = require('./user.service');
const { validationResult } = require('express-validator');
const userModel = require('./user.model');
const { createdUser } = require('./user.service');

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password, age} = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createdUser({
        name,
        email,
        password: hashedPassword,
        age,
    });

    const token = await user.generateAuthToken();

    res.status(200).json({user, token});
};

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    const user = await userModel.findOne({email});

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