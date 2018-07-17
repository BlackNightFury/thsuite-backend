const { Item, Product, ProductVariation, ProductType, Alert } = alias.require('@models');
const uuid = require('uuid');
const moment = require('moment');

module.exports = async function(item) {

    let existingItem = await Item.find({
        where: {
            id: item.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingItem) {
        existingItem = Item.build({});
    }

    let isNewRecord = existingItem.isNewRecord;

    if(!isNewRecord) {
        // if(existingItem.version !== item.version) {
        //     throw new Error("Version mismatch");
        // }

        existingItem.version++;
    }

    existingItem.id = item.id;
    existingItem.version = item.version;
    existingItem.name = item.name;
    existingItem.UnitOfMeasureName = item.UnitOfMeasureName;
    existingItem.UnitOfMeasureAbbreviation = item.UnitOfMeasureAbbreviation;
    existingItem.productTypeId = item.productTypeId;
    existingItem.thcWeight = item.thcWeight;

    await existingItem.save();

    if (  existingItem.MetrcId > 0 && existingItem.UnitOfMeasureName === 'Each' && existingItem.thcWeight > 0 ) {
        await Alert.destroy({
            where: {
                type: 'item-missing-thc-weight',
                entityId: existingItem.id
            }
        });
    };

    if(isNewRecord) {

        const productType = await ProductType.findOne({
            where: {
                id: existingItem.productTypeId
            }
        });

        await existingItem.createPackage({
            id: uuid.v4(),
            storeId: null,
            itemId: existingItem.id,
            availableQuantity: item.initialPackageQuantity,

            MetrcId: 0,
            Label: existingItem.name,
            PackageType: 'Product',
            Quantity: item.initialPackageQuantity,
            ReceivedQuantity: item.initialPackageQuantity,
            ReceivedDateTime: (productType && productType.cannabisCategory === 'NonCannabis') ? moment.utc().format('YYYY-MM-DDTHH:mm:ssZ').toString() : undefined,
            UnitOfMeasureName: 'Each',
            UnitOfMeasureAbbreviation: 'ea',
            wholesalePrice: 0,
        });

        //Create product

        let product = await Product.create({
            id: uuid.v4(),
            storeId: null,
            name: existingItem.name,
            description: "Auto-created from newly added item",
            inventoryType: 'each',
            productTypeId: existingItem.productTypeId,
            eligibleForDiscount: false,
            displayOnMenu: false,
            itemId: existingItem.id
        });

        //Create product variation
        let productVariation = await ProductVariation.create({
            id: uuid.v4(),
            storeId: null,
            productId: product.id,
            name: '1ea',
            description: "Auto-created from newly added item",
            price: 0,
            quantity: 1,
            readOnly: 0
        });

        let items = [];

        existingItem.ProductVariationItem = {
            quantity: 1
        };

        items.push(existingItem);

        await productVariation.setItems(items);

        this.broadcast.emit('create', existingItem.get({plain: true}));

    }
    else {
        this.broadcast.emit('update', existingItem.get({plain: true}));
    }

    return existingItem
};
