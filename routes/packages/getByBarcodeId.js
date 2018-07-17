const {BarcodeProductVariationItemPackage} = alias.require('@models');

module.exports = async function(barcodeId){

    let bpvip = await BarcodeProductVariationItemPackage.findAll({
        where: {
            barcodeId: barcodeId
        }
    });

    let packageIds = [];

    for(let barcodeProductVariationItemPackage of bpvip){

        packageIds.push(barcodeProductVariationItemPackage.packageId);

    }

    return packageIds;

};
