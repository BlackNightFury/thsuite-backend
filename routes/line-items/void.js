const { Barcode, LineItem } = alias.require('@models');

module.exports = async function(lineItemId){

    let object = await LineItem.findOne({
        include: [ { model: Barcode, required: false } ],
        where: {
            id: lineItemId
        }
    });

    if(!object) return

    if(object.barcodeId && object.Barcode){

        object.Barcode.remainingInventory += object.quantity;
        
        await object.Barcode.save();
    }

    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());
}
