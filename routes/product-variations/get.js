
const { ProductVariation, Item } = alias.require('@models');


module.exports = async function(productId) {

    let product = await ProductVariation.findOne({
        where: {
            id: productId
        },
        // include: [
        //     {
        //         model: Item,
        //         attributes: ['id']
        //     }
        // ]
    });

    return product.get({plain: true})
};