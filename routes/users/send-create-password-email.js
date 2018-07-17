const models = require("../../models");
const { User } = alias.require('@models');
const config = alias.require('@root/config/index');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGrid);

module.exports = async function(args) {
    console.log("Email: " + args.email.toString());

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
        subject: `THSuite New Employee: Create Your Password`,
        html: `<div>Welcome to THSuite! Please create your password: <a href="${href}" target="_blank">${href}</a>`
    } );


    user.save();

    return true;
};
