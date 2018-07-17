const {User} = alias.require('@models');

module.exports = async function(objectIds) {

    let objects = await User.findAll({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: {
                $in: objectIds
            }
        },
        paranoid: false
    });


    return objects.map(object => object.get({plain: true}));
};
