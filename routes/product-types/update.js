
const { ProductType } = alias.require('@models');


module.exports = async function(productType) {

    let existingProductType = await ProductType.find({
        where: {
            id: productType.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingProductType) {
        existingProductType = ProductType.build({});
    }

    let isNewRecord = existingProductType.isNewRecord;

    if(!isNewRecord) {
        // if(existingProductType.version !== productType.version) {
        //     throw new Error("Version mismatch");
        // }

        existingProductType.version++;
    }

    existingProductType.id = productType.id;
    existingProductType.version = productType.version;
    existingProductType.name = productType.name;
    existingProductType.unitOfMeasure = productType.unitOfMeasure;
    existingProductType.notes = productType.notes;

    //TODO Hard coded on frontend, should we trust?
    existingProductType.category = productType.category;
    existingProductType.cannabisCategory = productType.cannabisCategory;

    await existingProductType.save();

    if(isNewRecord) {
        this.broadcast.emit('create', existingProductType.get());
    }
    else {
        this.broadcast.emit('update', existingProductType.get());
    }

    return existingProductType
};