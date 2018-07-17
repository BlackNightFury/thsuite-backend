
const { EmailSettings } = alias.require('@models');

module.exports = async function(emailSettingsId){

    let emailSettings = await EmailSettings.findOne({
        where: {
            id: emailSettingsId
        },
        logging: console.log
    });

    return emailSettings.get({plain: true});

}