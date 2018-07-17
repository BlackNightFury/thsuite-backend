const BabyParse = require('babyparse');
const {Package, Barcode, BarcodeProductVariationItemPackage, Item, Product, ProductVariation, ProductType} = require('../../models');
const uuid = require('uuid');

function getBaseBarcodeForPackage(_package) {

    let supplierId = _package.Label.substr(11, 4);
    let lastFourDigits = _package.Label.substr(20, 4);

    if(/[a-z]{4}/i.test(supplierId)) {
        //No change
    }
    else if(/[a-z]{3}[0-9]/i.test(supplierId)) {
        supplierId = supplierId.substr(0, 3);
    }
    else if(/[a-z][0-9]{2}[a-z]/i.test(supplierId)) {
        //No change
    }

    return supplierId + lastFourDigits;
}

(async function() {

    let budsProductType = await ProductType.findOne({
        where: {
            name: 'Buds'
        }
    });

    let packages = await Package.findAll({
        where: {
            Quantity: {$gt: 0},

        },
        include: [
            {
                model: Item,
                where: {
                    productTypeId: budsProductType.id
                },
                include: [
                    {
                        model: Product,
                        include: [
                            ProductVariation
                        ]
                    }
                ]
            }
        ]
    });

    console.log(`Found ${packages.length} packages`);

    for(let _package of packages) {

        // console.log(_package.get({plain: true}));
        // break;

        for(let productVariation of _package.Item.Product.ProductVariations) {

            if(productVariation.quantity != 1 && productVariation.quantity != 3.5) {
                console.error("Invalid product variation");
                console.log(productVariation);
                continue;
            }

            let barcodeString = getBaseBarcodeForPackage(_package) + (productVariation.quantity == 1 ? 1 : 3);

            await Barcode.create({
                id: uuid.v4(),
                barcode: barcodeString,
                productVariationId: productVariation.id,
                allocatedInventory: _package.Quantity / productVariation.quantity,
                remainingInventory: _package.Quantity / productVariation.quantity,
                BarcodeProductVariationItemPackages: [
                    {
                        id: uuid.v4(),
                        productVariationId: productVariation.id,
                        itemId: _package.Item.id,
                        packageId: _package.id
                    }
                ]
            }, {
                include: [
                    BarcodeProductVariationItemPackage
                ]
            });

            console.log(`Created barcode ${barcodeString}`);
        }
    }

})();