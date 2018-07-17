const { Package, Transaction } = alias.require('@models');
module.exports = async function(objectId){

    let object = await Transaction.findOne({
        include: [ Package ],
        where: {
            id: objectId
        }
    });

    if(!object) return

    //Decrease package.Quantity by quantity, barcode.remainingInventory by 1
    object.Package.Quantity += object.QuantitySold;
                
    await object.Package.save();
    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());
}
