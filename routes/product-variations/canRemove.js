const { ProductVariation, Barcode } = alias.require('@models');
module.exports = async function(productVariationId){

    let barcodes = await Barcode.findAll({
        where: {
            productVariationId: productVariationId
        }
    });

    let canRemove = true;
    for(let barcode of barcodes){
        if(barcode.allocatedInventory != null){
            canRemove = false;
            break;
        }
    }

    return canRemove;

}
