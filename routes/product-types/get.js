
const { ProductType } = alias.require('@models');


module.exports = async function(productTypeId) {

    let productType = await ProductType.findOne({
        where: {
            id: productTypeId
        }
    });

    if( !productType ) return null
    return productType.get({plain: true});
};
