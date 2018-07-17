const {Product} = alias.require('@models');
module.exports = async function(pricingTierId){

    let products = await Product.findAll({
        where:{
            pricingTierId: pricingTierId
        }

    });

    console.log(products);

    return !products.length;

}
