
const { Barcode } = alias.require('@models');


module.exports = async function(productVariationId) {

    let barcodes = await Barcode.findAll({
        where: {
            productVariationId: productVariationId
        }
    });

    return barcodes.map(b => b.id);
};