const {BarcodeProductVariationItemPackage} = alias.require('@models');

module.exports = async function({packageId}){

    let bpvip = await BarcodeProductVariationItemPackage.findAll({where:{packageId}})

    let barcodeIds = [];

    for(let barcodeProductVariationItemPackage of bpvip){

        barcodeIds.push(barcodeProductVariationItemPackage.barcodeId);

    }

    return barcodeIds;

};
