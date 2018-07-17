const BabyParse = require('babyparse');
const {Package, ProductType} = require('../../models');
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

    let budsProductType = await ProductType.findOne({
        where: {
            name: 'Buds'
        }
    });


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

        if(product.productTypeId != budsProductType.id) {
            continue;
        }

        let productVariations = await product.getProductVariations();

        let variationSizes = [1, 3.5];

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