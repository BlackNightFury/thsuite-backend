
const { Product } = alias.require('@models');


module.exports = async function(itemId) {

    let products = await Product.findAll({
        where: {
            itemId: itemId
        }
    });

    return products.map(p => p.id);
};
