
const { Permission } = alias.require('@models');


module.exports = async function(userId) {

    let permission = await Permission.findOne({
        where: {
            userId: userId
        }
    });

    if(!permission) return null;

    return permission.id;
};
