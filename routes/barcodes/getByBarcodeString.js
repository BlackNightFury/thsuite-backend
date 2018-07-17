const { Barcode } = alias.require('@models');

module.exports = async function(barcode) {

    const barcodeObj = await Barcode.findOne({
        attributes: ['id'],
        where: {
            barcode: barcode
        }
    });

    return barcodeObj ? barcodeObj.id : null;
};