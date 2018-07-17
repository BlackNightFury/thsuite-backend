const BabyParse = require('babyparse');
const {Package, Barcode, BarcodeProductVariationItemPackage} = require('../../models');
const uuid = require('uuid');


function extractWeightInGrams(row) {

    if(/([\d.]+)g/i.exec(row.NAME)) {
        return /([\d.]+)g/i.exec(row.NAME)[1];
    }

    if(/([\d.])mg/i.exec(row.NAME)) {
        return /([\d.])mg/i.exec(row.NAME)[1] / 1000;
    }

    return 1;
}

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export-clean.csv', {
        header: true
    });


    for(let row of data) {

        if(row['QTY ON HAND'] <= 0) {
            console.log(`QTY ON HAND for ${row.RFID} is zero or less, not allocating (${row['QTY ON HAND']})`);
            continue;
        }

        let _package = await Package.findOne({
            where: {
                Label: row.RFID
            }
        });

        if(!_package) {
            console.log(`Could not find package for ${row.RFID}`);
            continue;
        }

        if(_package.Quantity <= 0) {
            console.log(`Quantity for ${row.RFID} is zero or less, not allocating (${_package.Quantity})`);
            continue;
        }

        let item = await _package.getItem();
        let product = await item.getProduct();

        let productVariations = await product.getProductVariations();

        let variationSize;
        if(product.inventoryType == 'weight') {
            variationSize = extractWeightInGrams(row);
        }

        let productVariation;
        if(variationSize) {
            productVariation = productVariations.find(variation => variation.quantity == variationSize);
        }
        else {
            productVariation = productVariations[0];
        }


        if(!productVariation) {
            console.log(`Product variation missing for ${row.RFID}`);
            continue;
        }

        console.log(`Allocating barcode ${row.BARCODE}`);

        if(product.inventoryType == 'each') {

            await Barcode.create({
                id: uuid.v4(),
                barcode: row['BARCODE'],
                productVariationId: productVariation.id,
                allocatedInventory: row['QTY ON HAND'],
                remainingInventory: row['QTY ON HAND'],
                BarcodeProductVariationItemPackages: [
                    {
                        id: uuid.v4(),
                        productVariationId: productVariation.id,
                        itemId: item.id,
                        packageId: _package.id
                    }
                ]
            }, {
                include: [
                    BarcodeProductVariationItemPackage
                ]
            });


            _package.availableQuantity -= row['QTY ON HAND'];
            await _package.save()

        }
        else { //weight

            await Barcode.create({
                id: uuid.v4(),
                barcode: row['BARCODE'],
                productVariationId: productVariation.id,
                allocatedInventory: row['QTY ON HAND'],
                remainingInventory: row['QTY ON HAND'],
                BarcodeProductVariationItemPackages: [
                    {
                        id: uuid.v4(),
                        productVariationId: productVariation.id,
                        itemId: item.id,
                        packageId: _package.id
                    }
                ]
            }, {
                include: [
                    BarcodeProductVariationItemPackage
                ]
            });


            _package.availableQuantity -= row['QTY ON HAND'] * productVariation.quantity;
            await _package.save()
        }

    }

})();