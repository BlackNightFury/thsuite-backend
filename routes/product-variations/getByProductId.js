
const { ProductVariation } = alias.require('@models');


module.exports = async function(productId) {

    let productVariations = await ProductVariation.findAll({
        where: {
            productId: productId
        },
    });

    return productVariations.map(p => p.id);
};