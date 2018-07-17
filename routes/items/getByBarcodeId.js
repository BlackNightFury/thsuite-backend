const {BarcodeProductVariationItemPackage} = alias.require('@models');

module.exports = async function(barcodeId){

    let bpvip = await BarcodeProductVariationItemPackage.findAll({
        where: {
            barcodeId: barcodeId
        }
    });

    let itemIds = [];

    for(let barcodeProductVariationItemPackage of bpvip){

        itemIds.push(barcodeProductVariationItemPackage.itemId);

    }

    return itemIds;

};
