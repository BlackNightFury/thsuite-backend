const { User } = alias.require('@models');
const config = alias.require('@root/config/index');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGrid);

module.exports = async function(details){

    let mailResult = await sgMail.send( {
        to: ["simon@thsuite.com", "anne@thsuite.com"],
        from: 'noreply@thsuite.com',
        subject: `THSuite Help Request`,
        html: `<div>A help request form was submitted by ${details.email} about ${details.category}. The message they submitted is below:</div><br><br><div>${details.message}</div>`
    } );

    console.log(mailResult);

}
