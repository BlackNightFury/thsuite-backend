const { User, Permission} = alias.require('@models');
const config = alias.require('@root/config/index');
const jwt = require('jsonwebtoken');
const extend = require('extend');

module.exports = async function(auth) {

    const user = await User.findOne({
        where: {
            $or: [ { email: auth.username }, { badgeId: auth.username } ],
            isActive: true
        },
        include: [ Permission ],
        logging: console.log
    });

    if(!user) {
        throw new Error("Invalid username");
    }

    if (user.password == null) {
        throw new Error("New user");
    }

    if(!User.check(auth.password, user.password)) {
        throw new Error("Invalid password");
    }

    this.client.user = user;

    let userToFrontend = user.get();
    delete userToFrontend.password;

    // If user has permission then generate JWT for 24h
    if (user.Permission.canPersistentLogin) {
        userToFrontend.loginToken = jwt.sign({
            id: user.id,
            email: user.email
        }, config.JWT_SECRET, { expiresIn: '24h' });
    }

    console.log(userToFrontend);
    this.client.authenticated = true;
    return userToFrontend;
};
