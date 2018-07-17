
const { Product } = alias.require('@models');


module.exports = async function(productId) {

    let product = await Product.findOne({
        where: {
            id: productId
        }
    });

    return product.get({plain: true})
};