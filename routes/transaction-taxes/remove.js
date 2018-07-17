const { TransactionTax } = alias.require('@models');
module.exports = async function(objectId){

    let object = await TransactionTax.findOne({
        where: {
            id: objectId
        }
    });

    if(!object) return
    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());
}
