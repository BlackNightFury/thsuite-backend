const {User} = alias.require('@models');

module.exports = async function({ pin, userId }){

    const duplicate = await User.find({
        attributes: ['id'],
        where: {
            $or: [
                { pin: pin },
                { posPin: pin }
            ],
            id: {
                $not: userId
            }
        }
        ,logging: console.log
    });

    return !!duplicate;
}
