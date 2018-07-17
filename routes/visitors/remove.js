
const { Visitor } = alias.require('@models');

module.exports = async function(objectId) {

    const object = await Visitor.findOne({
        where: {
            id: objectId
        }
    });

    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());
};
