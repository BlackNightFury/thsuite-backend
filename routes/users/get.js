
const { User } = alias.require('@models');


module.exports = async function(userId) {

    let user = await User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: userId
        }
    });

    if(!user) return null
    return user.get({plain: true})
};
