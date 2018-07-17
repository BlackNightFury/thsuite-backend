const { Barcode, BarcodeProductVariationItemPackage } = alias.require('@models');
module.exports = async function(objectId){

    let object = await Barcode.findOne({
        where: {
            id: objectId
        }
    });

    await object.destroy();

    let bpvip = await BarcodeProductVariationItemPackage.findOne({
        where: {
            barcodeId: objectId
        }
    });

    await bpvip.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());

}


