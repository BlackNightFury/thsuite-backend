const {User} = alias.require('@models');

module.exports = async function(args){

    let email = args.email;
    let userId = args.userId;

    let duplicate = await User.find({
        attributes: ['id'],
        where: {
            email: email,
            id: {
                $not: userId
            }
        }
    });

    return !!duplicate;

}
