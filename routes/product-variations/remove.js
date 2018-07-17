const { ProductVariation, Barcode, ProductVariationItem, BarcodeProductVariationItemPackage } = alias.require('@models');
module.exports = async function(objectId){

    let object = await ProductVariation.findOne({
        where: {
            id: objectId
        }

    });

    let pvi = await ProductVariationItem.findOne({
        where: {
            productVariationId: objectId
        }
    });

    await pvi.destroy();

    let barcodes = await Barcode.findAll({
        where: {
            productVariationId: objectId
        }
    });

    for(let barcode of barcodes){
        await barcode.destroy();
    }

    let bpvips = await BarcodeProductVariationItemPackage.findAll({
        where: {
            productVariationId: objectId
        }
    });

    for(let bpvip of bpvips){
        await bpvip.destroy();
    }

    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());

}



