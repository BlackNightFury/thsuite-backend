const { ProductVariation, Item, Tag, TagProductVariation } = alias.require('@models');
const uuid = require('uuid/v4')

module.exports = async function(productVariation) {

    let existingProductVariation = await ProductVariation.find({
        where: {
            id: productVariation.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingProductVariation) {
        existingProductVariation = ProductVariation.build({});
    }

    let isNewRecord = existingProductVariation.isNewRecord;

    if(!isNewRecord) {
        // if(existingProductVariation.version !== productVariation.version) {
        //     throw new Error("Version mismatch");
        // }

        productVariation.version++;
    }

    existingProductVariation.id = productVariation.id;
    existingProductVariation.version = productVariation.version;
    
    existingProductVariation.productId = productVariation.productId;

    existingProductVariation.name = productVariation.name;
    existingProductVariation.description = productVariation.description;

    existingProductVariation.price = productVariation.price;
    existingProductVariation.quantity = productVariation.quantity;

    existingProductVariation.readOnly = productVariation.readOnly;
    existingProductVariation.isBulkFlower = productVariation.isBulkFlower;

    await existingProductVariation.save();


    if(productVariation.Items.length) {

        let items = [];
        for (let item of productVariation.Items) {
            let dbItem = await Item.findOne({
                where: {
                    id: item.id
                }
            });

            dbItem.ProductVariationItem = {
                quantity: item.ProductVariationItem.quantity
            };

            items.push(dbItem);
        }

        await existingProductVariation.setItems(items);
    }

    await TagProductVariation.destroy( { where: { productVariationId: productVariation.id } } )
    if(productVariation.Tags){
        await Promise.all( productVariation.Tags.map( async tag => TagProductVariation.create( { id: uuid(), productVariationId: productVariation.id, tagId: tag.id } ) ) )
    }

    if(isNewRecord) {
        this.broadcast.emit('create', existingProductVariation.get());
    }
    else {
        this.broadcast.emit('update', existingProductVariation.get());
    }

    return existingProductVariation
};
