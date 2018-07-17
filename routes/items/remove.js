const { Item, Product } = alias.require('@models');
const productRemove = require('../products/remove');
module.exports = async function(objectId){

    let object = await Item.findOne({
        where: {
            id: objectId
        }
    });

    let product = await Product.findOne({
        where: {
            itemId: objectId
        }
    });

    if(product){
        await productRemove.call(this, product.id);
    }

    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());

}

