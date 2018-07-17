
const { EmailSettings } = alias.require('@models');

module.exports = async function(userId){

    let emailSettings = await EmailSettings.findOne({
        where:{
            userId: userId
        }
    });

    if(!emailSettings) return null

    return emailSettings.id;

}
