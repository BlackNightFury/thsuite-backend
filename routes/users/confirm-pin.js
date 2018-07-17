
const {User} = alias.require('@models');

module.exports = async function(pin){
    console.log("Received PIN: " + pin);
    let user = await User.findOne({
        where: {
            pin: pin
        }
    });

    return !!user;
}