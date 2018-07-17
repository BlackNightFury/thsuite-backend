const models = require("../../models");
const { User } = alias.require('@models');

module.exports = async function(args) {


    let user = await User.findOne({
        where: {id: args.id}
    });

    if(user){
        user.password = models.User.hash(args.password);
        user.save();
        return user;
    }else{
        return false;
    }
};