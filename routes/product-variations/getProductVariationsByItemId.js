const { ProductVariation, ProductVariationItem } = alias.require('@models');

module.exports = async function(itemId) {

    const productVariations = await ProductVariationItem.findAll({
        where: { itemId },
        include: [ ProductVariation ],
        logging: console.log
    });

    return productVariations.map(p => p.ProductVariation.id);
};