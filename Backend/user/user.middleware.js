const userModel = require('./user.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token ||  req.header("Authorization")?.split(" ")[1];

    if(!token) {
        return res.status(401).send('Unauthorized Access');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded._id });
        if(!user) {
            return res.status(404).send('User not found');
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }
};