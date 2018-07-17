const BabyParse = require('babyparse');
const {Item, Package, Product, ProductVariationItem} = require('../../models');
const uuid = require('uuid');

const storeId = 'c0204f66-f2da-4eb8-9f09-9151115bb92f';
const productTypeId = '92353003-b836-46aa-8739-9e6bea002dc1';

(async function(){

    let {data, meta} = BabyParse.parseFiles('./product list.csv', {
        header: true
    });



    let filtered = data.filter((row) => row.CATEG_COD == "NON THC");

    for(let productRow of filtered){
        let item = await Item.create({
            id: uuid.v4(),
            storeId: storeId,
            name: productRow.DESCR,
            UnitOfMeasureName: "Each",
            UnitOfMeasureAbbreviation: 'ea',
            productTypeId: productTypeId
        });

        let _package = await Package.create({
            id: uuid.v4(),
            storeId: storeId,
            itemId: item.id,
            wholesalePrice: 0,
            availableQuantity: 1000,
            Quantity: 1000,
            MetrcId: 0,
            Label: productRow.DESCR_UPR.replace(' ', '-').replace('$', '')
        });

        let product = await Product.create({
            id: uuid.v4(),
            storeId: storeId,
            name: productRow.DESCR,
            description: productRow.LONG_DESCR,
            inventoryType: 'each',
            productTypeId: productTypeId
        });

        let productVariation = await product.createProductVariation({
            id: uuid.v4(),
            storeId: product.storeId,
            name: '1ea',
            description: 'Imported from dump',
            price: productRow.PRC_1,
            quantity: 1,
        });

        let productVariationItem = await ProductVariationItem.create({
            id: uuid.v4(),
            productVariationId: productVariation.id,
            itemId: item.id,
            quantity: 1
        });
    }

})();
