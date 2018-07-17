const {Discount} = alias.require('@models');

module.exports = async function(objectIds) {

    let objects = await Discount.findAll({
        where: {
            id: {
                $in: objectIds
            }
        },
        paranoid: false
    });

    return objects.map(object => {
        object.get({plain: true});
        object.days = object.days ? object.days.split(',') : [];
        return object;
    });
};
