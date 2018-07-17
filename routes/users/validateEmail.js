const emailValidator = require('email-validator');
const legit = require('legit');

module.exports = async function(args) {

    let isValidFormat = emailValidator.validate(args.email);

    if(!isValidFormat) {
        return false;
    }

    try {
        await Promise.fromCallback(cb => legit(args.email, cb));
    }
    catch(e) {
        return false;
    }

    return true;

};
