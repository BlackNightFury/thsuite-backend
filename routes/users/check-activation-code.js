const models = require("../../models");
const { User } = alias.require('@models');

module.exports = async function(args) {


    let user = await User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            status: -1,
            activation: args.code
        }
    });

    if(user){
        user.status = 1;
        user.save();
    }

    return user;
};
