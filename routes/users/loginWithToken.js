const { User, Permission} = alias.require('@models');
const config = alias.require('@root/config/index');
const jwt = require('jsonwebtoken');
const extend = require('extend');

module.exports = async function(auth) {

    console.log("DATA");

    const data = jwt.verify(auth.loginToken, config.JWT_SECRET);

    const user = await User.findOne({
        where: {
            id: data.id,
            isActive: true
        },
        include: [ Permission ],
        logging: console.log
    });

    if(!user) {
        throw new Error("Invalid credentials");
    }

    let userToFrontend = user.get();
    delete userToFrontend.password;

    this.client.authenticated = true;

    if(!user.isAPIUser){
        // If user has permission then generate JWT for 24h
        if (user.Permission.canPersistentLogin) {
            userToFrontend.loginToken = jwt.sign({
                id: user.id,
                email: user.email
            }, config.JWT_SECRET, { expiresIn: '24h' });
        } else {
            throw new Error("User can't login with loginToken anymore");
        }

        this.client.user = user;

        console.log(userToFrontend);

        return userToFrontend;

    }else{
        //API login just needs to be notified of success
        return true;
    }


};
