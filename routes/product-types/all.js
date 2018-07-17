
const { ProductType } = alias.require('@models');


module.exports = async function() {

    let productTypes = await ProductType.findAll({
        attributes: ['id']
    });

    return productTypes.map(p => p.id)
};