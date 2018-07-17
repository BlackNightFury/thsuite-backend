const {User} = alias.require('@models');

module.exports = async function({ pin, userId }){

    const duplicate = await User.find({
        attributes: ['id'],
        where: {
            pin: pin,
            id: {
                $not: userId
            }
        }
    });

    return !!duplicate;
}
