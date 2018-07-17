const BabyParse = require('babyparse');
const {Package} = require('../../models');
const uuid = require('uuid');

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export-clean.csv', {
        header: true
    });


    let labelWholesaleMap = Object.create(null);

    for(let row of data) {
        labelWholesaleMap[row.RFID] = labelWholesaleMap[row.RFID] || [];

        labelWholesaleMap[row.RFID].push(row);
    }

    let multiplePriceLabels = [];

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

        if(_package.UnitOfMeasureAbbreviation != 'ea') {
            continue;
        }

        let item = await _package.getItem();
        let product = await item.getProduct();

        let productVariations = await product.getProductVariations();

        if(labelWholesaleMap[label].length == 1) {

            let row = labelWholesaleMap[label][0];

            let price = row['Price'].replace(/\$/g, '');

            productVariations[0].price = price;
            console.log(`Package ${label} has sale price ${productVariations[0].price}`);

            await productVariations[0].save();
        }
        else {
            let row = labelWholesaleMap[label];
            let firstSellPrice = row[0]['Price'];
            if(row.every(sellPrice => sellPrice['Price'] == firstSellPrice)) {

                let price = firstSellPrice.replace(/\$/g, '');

                productVariations[0].price = price;
                console.log(`Package ${label} has sale price ${productVariations[0].price}`);
                await productVariations[0].save();
            }
            else {
                console.log(`Multiple prices for package ${label}`);
                multiplePriceLabels.push(label);
            }
        }

    }

    console.log("The following labels had multiple prices");
    console.log(multiplePriceLabels);

})();