const userModel = require('./user.model');

module.exports.createdUser = async({
    first, last, email, password, age
}) => {
    const user = new userModel({
        name: {
            first,
            last,
        },
        email,
        password,
        age,
    });
    return user;
}