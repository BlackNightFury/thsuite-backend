const { Barcode, Product, ProductVariation, ProductVariationItem, Item, Package, BarcodeProductVariationItemPackage, sequelize } = alias.require('@models');
const config = require('../../config');

const updateCommon = require('../common/update');

module.exports = async function(barcode) {

    let isNewRecord;
    let existingBarcode;

    await sequelize.transaction(async function (t) {

        existingBarcode = await Barcode.find({
            where: {
                id: barcode.id,
            },
            transaction: t
        });

        if(!existingBarcode) {
            existingBarcode = Barcode.build({});
        }

        isNewRecord = existingBarcode.isNewRecord;

        existingBarcode.id = barcode.id;
        existingBarcode.version = barcode.version;
        existingBarcode.barcode = barcode.barcode;
        existingBarcode.productVariationId = barcode.productVariationId;
        existingBarcode.allocatedInventory = barcode.allocatedInventory;
        existingBarcode.remainingInventory = barcode.remainingInventory;

        await existingBarcode.save({transaction: t});

        //Only create these records if this is a new barcode
        if(isNewRecord) {
        for (let item of barcode.ItemPackages) {

                let dbItem = await BarcodeProductVariationItemPackage.build({});

            //Set product variation id, and item id, then get the package for this item
            dbItem.barcodeId = existingBarcode.id;
            dbItem.productVariationId = existingBarcode.productVariationId;
            dbItem.itemId = item.itemId;
            dbItem.packageId = item.packageId;

                await dbItem.save({transaction: t});
            }
        }

    });

    if(isNewRecord) {
        this.broadcast.emit('create', existingBarcode.get());
    }
    else {
        this.broadcast.emit('update', existingBarcode.get());
    }

    return existingBarcode;

};
