const { User, Permission} = alias.require('@models');
const config = alias.require('@root/config/index');
const jwt = require('jsonwebtoken');

//Note: this should only be used through the web app, must be behind auth for API, tokens from here last 6mo
module.exports = async function(userId){
    //Need just userId
    const user = await User.findOne({
        where: {
            id: userId,
            isActive: true
        },
        include: [ Permission ],
        logging: console.log
    });

    if(!user){
        throw new Error('Invalid user ID');
    }

    let token = jwt.sign({
        id: user.id,
        email: user.email
    }, config.JWT_SECRET, { expiresIn: '72 hours' });

    console.log(`TOKEN: ${token}`);

    return token;
}