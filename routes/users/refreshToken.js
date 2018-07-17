const { User, Permission} = alias.require('@models');
const config = alias.require('@root/config/index');
const jwt = require('jsonwebtoken');

//Note: this should only be used via API, must be behind auth
module.exports = async function(auth){

    const data = jwt.verify(auth.loginToken, config.JWT_SECRET);

    const user = await User.findOne({
        where: {
            id: data.id,
            isActive: true
        },
        include: [ Permission ],
        logging: console.log
    });

    if(!user){
        throw new Error('Invalid user ID token');
    }

    let token = jwt.sign({
        id: user.id,
        email: user.email
    }, config.JWT_SECRET, { expiresIn: '72 hours' });

    console.log(`REFRESHED TOKEN: ${token}`);

    return token;
}