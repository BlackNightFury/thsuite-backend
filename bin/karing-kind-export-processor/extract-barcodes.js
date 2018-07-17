const BabyParse = require('babyparse');
const {Package, Barcode, BarcodeProductVariationItemPackage} = require('../../models');
const uuid = require('uuid');


function extractWeightInGrams(row) {

    if(/([\d.]+)g/i.exec(row['MJ Item'])) {
        return /([\d.]+)g/i.exec(row['MJ Item'])[1];
    }

    if(/([\d.])mg/i.exec(row['MJ Item'])) {
        return /([\d.])mg/i.exec(row['MJ Item'])[1] / 1000;
    }

    return 1;
}

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export-clean.csv', {
        header: true
    });


    for(let row of data) {

        if(!row['Barcode'] || !row['Barcode'].trim()) {
            console.log(`${row.RFID} does not have a barcode`);
            continue;
        }

        let quantity = parseFloat(row['Quantity']);

        if(quantity != row['Quantity'] || quantity <= 0) {
            console.log(`Quantity for ${row.RFID} is zero or less, not allocating (${row['Quantity']})`);
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

        console.log(`Allocating barcode ${row['Barcode'].replace(/'/g, '')}`);

        if(product.inventoryType == 'each') {

            await Barcode.create({
                id: uuid.v4(),
                barcode: row['Barcode'].replace(/'/g, ''),
                productVariationId: productVariation.id,
                allocatedInventory: row['Quantity'],
                remainingInventory: row['Quantity'],
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


            _package.availableQuantity -= row['Quantity'];
            await _package.save()

        }
        else { //weight

            await Barcode.create({
                id: uuid.v4(),
                barcode: row['Barcode'].replace(/'/g, ''),
                productVariationId: productVariation.id,
                allocatedInventory: row['Quantity'],
                remainingInventory: row['Quantity'],
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


            _package.availableQuantity -= row['Quantity'] * productVariation.quantity;
            await _package.save()
        }

    }

})();