const { Barcode } = alias.require('@models');

module.exports = async function(name, number) {

    let barcodes = await Barcode.findAll({
        attributes: ['id']
    });

    return barcodes.map(p => p.id)
};