const { Barcode, BarcodeProductVariationItemPackage } = alias.require('@models');


module.exports = async function(packageId) {

    let barcodes = await BarcodeProductVariationItemPackage.findAll({
        attributes: ['id', 'barcodeId'],
        where: {
            packageId: packageId
        },
        include: [
            {
                model: Barcode,
                attributes: ['id']
            }
        ]
    });

    return barcodes && barcodes.length ? barcodes.map(b => b.barcodeId) : [];
};
