const { Discount } = alias.require('@models');
module.exports = async function(objectId){

    let object = await Discount.findOne({
        where: {
            id: objectId
        }
    });

    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());

}


