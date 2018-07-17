const {ProductVariation, Item} = alias.require('@models');

module.exports = async function(objectIds) {

    let objects = await ProductVariation.findAll({
        where: {
            id: {
                $in: objectIds
            }
        },
        include: [
            {
                model: Item,
                attributes: ['id']
            }
        ],
        paranoid: false
    });


    return objects.map(object => object.get({plain: true}));
};

