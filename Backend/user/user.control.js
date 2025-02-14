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