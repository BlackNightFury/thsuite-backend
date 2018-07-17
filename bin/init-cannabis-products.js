require("../init");
let models = require("../models");


(async function() {

    let productTypes = await models.ProductType.findAll();


    for(let productType of productTypes) {

        for(let i of [1, 2, 3, 4]) {
            let product = await productType.createProduct({
                name: `${productType.name} (${i})`,
                image: `/assets/img/prod${i}.jpg`,
                sku: `${Math.floor(Math.random() * 1e9)}`,
                price: 5 * i,
                quantity: 1
            });

            let metrcPackage = await product.createPackage({
                UnitOfMeasureName: 'Grams',
                MetrcId: Math.floor(Math.random() * 1e5),
                Label: `${Math.floor(Math.random() * 1e9)}`,
                Quantity: 10
            });

            await product.createPackage({
                UnitOfMeasureName: 'Grams',
                MetrcId: Math.floor(Math.random() * 1e5),
                Label: `${Math.floor(Math.random() * 1e9)}`,
                Quantity: 50
            });

            await product.setPrimaryPackage(metrcPackage);
        }

    }


})().catch(err => console.error(err));