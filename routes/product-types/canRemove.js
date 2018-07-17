const { Product } = alias.require('@models');
module.exports = async function(productTypeId){
    //Can delete if there are no products with this productTypeId
    let products = await Product.findAll({
        where: {
            productTypeId: productTypeId
        }
    });


    return !products.length;
}
