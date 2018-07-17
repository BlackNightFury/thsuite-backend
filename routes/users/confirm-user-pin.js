
const {User} = alias.require('@models');

module.exports = async function(userId, pin){
    console.log("Received User ID, PIN: " + [userId, pin]);
    let user = await User.findOne({
        where: {
            id: userId,
            pin: pin
        }
    });

    return !!user;
}