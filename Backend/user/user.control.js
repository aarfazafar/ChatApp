const userService = require('./user.service');
const { validationResult } = require('express-validator');
const userModel = require('./user.model');
const tokenBlacklistModel = require('./tokenBlacklist.model');
// const { generate} = require("random-words");
// import randomWords from "random-words";
const randomWords = require("random-words");

// Generate a single random word

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const randomName = randomWords({
        exactly: 3,
        wordsPerString: 1,
        minLength: 7,
        separator: "_",
        formatter: (word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        },
      }).join("");
    const {name, email, password, age} = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createdUser({
        first: name.first,
        last: name.last,
        username: randomName,
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
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
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

module.exports.changeUsername = async (req, res) => {
    try {
        const {newUsername} = req.body;
        const userId = req.user._id;

        if(!newUsername) {
            return res.status(400).json({message: "New username required"});
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {username: newUsername},
            {new: true}
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
      
        res.status(200).json({ message: "Username updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
}