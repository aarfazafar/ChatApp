const userModel = require('./user.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.header.authorization;

    if(!token) {
        return res.status(401).send('Unauthorized Access');
    }
};