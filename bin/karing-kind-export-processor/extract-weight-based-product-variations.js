const BabyParse = require('babyparse');
const {Package} = require('../../models');
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


    let labelWholesaleMap = Object.create(null);

    for(let row of data) {
        labelWholesaleMap[row.RFID] = labelWholesaleMap[row.RFID] || [];

        labelWholesaleMap[row.RFID].push(row);
    }


    for(let label of Object.keys(labelWholesaleMap)) {

        let _package = await Package.findOne({
            where: {
                Label: label
            }
        });

        if(!_package) {
            console.log(`Could not find package for ${label}`);
            continue;
        }

        let row = labelWholesaleMap[label];

        let item = await _package.getItem();
        let product = await item.getProduct();

        if(product.inventoryType == 'each') {
            continue;
        }

        let productVariations = await product.getProductVariations();

        let variationSizes = row.map(_package => extractWeightInGrams(_package));

        for(let variationSize of variationSizes) {

            if(productVariations.some(variation => variation.quantity == variationSize)) {

            }
            else {
                console.log(`Creating variation ${product.name} ${variationSize}g`);
                let newVariation = await product.createProductVariation({
                    id: uuid.v4(),
                    storeId: product.storeId,
                    name: `${variationSize}g`,
                    description: 'Imported from dump',
                    price: null,
                    quantity: variationSize,
                });

                await newVariation.addItem(item, {quantity: variationSize});

                productVariations.push(newVariation);
            }

        }

    }

})();