const userModel = require('./user.model');

module.exports.createdUser = async({
    first, last, username, email, password, age
}) => {
    const user = new userModel({
        name: {
            first,
            last,
        },
        username,
        email,
        password,
        age,
    });
    return user;
}