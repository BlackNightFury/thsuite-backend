const { Product, Tag, TagProduct } = alias.require('@models');
const uuid = require('uuid/v4')

module.exports = async function(product) {

    let existingProduct = await Product.find({
        where: {
            id: product.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingProduct) {
        existingProduct = Product.build({});
    }

    let isNewRecord = existingProduct.isNewRecord;

    if(!isNewRecord) {
        // if(existingProduct.version !== product.version) {
        //     throw new Error("Version mismatch");
        // }

        product.version++;
    }

    existingProduct.id = product.id;
    existingProduct.version = product.version;

    existingProduct.name = product.name;
    existingProduct.description = product.description;
    existingProduct.image = product.image || '/assets/img/prod1.jpg';
    existingProduct.inventoryType = product.inventoryType;
    existingProduct.productTypeId = product.productTypeId;
    existingProduct.pricingTierId = product.pricingTierId;
    existingProduct.eligibleForDiscount = product.eligibleForDiscount;
    existingProduct.displayOnMenu = product.displayOnMenu;

    await existingProduct.save();

    await TagProduct.destroy( { where: { productId: product.id }, force: true } )
    if (product.Tags){
        await Promise.all( product.Tags.map( async tag => TagProduct.create( { id: uuid(), productId: product.id, tagId: tag.id } ) ) )
    }

    if(isNewRecord) {
        this.broadcast.emit('create', existingProduct.get());
    }
    else {
        this.broadcast.emit('update', existingProduct.get());
    }

    return existingProduct
};
