const models = require("../../models");
const { User } = alias.require('@models');
const config = alias.require('@root/config/index');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGrid);

module.exports = async function(args) {


    let user = await User.findOne({
        where: {
            email: args.email
        }
    });

    if(!user) return false;

    user.status = -1;
    user.activation = models.User.generateActivationCode();

    const port = config.express.clientPort === 80 ? `` : `:${config.express.clientPort}`;
    const href = `http://${config.express.domain}${port}/auth/activate/${user.activation}`;

    let mailResult = await sgMail.send( {
        to: args.email,
        from: 'noreply@thsuite.com',
        subject: `THSuite Password Reset`,
        html: `<div>Reset password link: <a href="${href}" target="_blank">${href}</a>`
    } );

    console.log("mailResultwya");
    user.save();
    console.log("mailResultwya");

    return true;
};
