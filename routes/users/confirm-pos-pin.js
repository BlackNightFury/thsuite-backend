
const {User} = alias.require('@models');

module.exports = async function({ pin }){
    console.log("Received PIN: " + pin);

    const user = await User.findOne({
        attributes: ['id', 'pin'],
        where: {
            $or: [
                { pin: pin },
                { posPin: pin }
            ]
        }, logging:console.log
    });

    return user ? user.id : false;
}
