const productVariationRemove = require('../product-variations/remove');
const { Product, ProductVariation, Item } = alias.require('@models');

module.exports = async function(objectId){

    let object = await Product.findOne({
        where: {
            id: objectId
        }
    });

    let variations = await ProductVariation.findAll({
        where: {
            productId: objectId
        }
    });

    if(object.itemId){

        let item = await Item.findOne({
            where: {
                id: object.itemId
            }
        });

        await item.destroy();

    }

    for(let variation of variations){
        await productVariationRemove.call(this, variation.id);
    }

    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());

}
