const {ProductType, Product, Item, Strain} = alias.require('@models');
const uuid = require('uuid');

let createdItems = {};


module.exports = async function(store, metrcItem) {

    if(createdItems[metrcItem.ProductId || metrcItem.Id]) {
        return createdItems[metrcItem.ProductId || metrcItem.Id];
    }

    let productType = await ProductType.find({
        where: {
            name: metrcItem.ProductCategoryName
        }
    });

    let strain = await Strain.find({
        where: {
            MetrcId: metrcItem.StrainId
        }
    });
    if(!strain) {
        strain = await Strain.create({
            id: uuid.v4(),
            storeId: store.id,

            name: metrcItem.StrainName,
            MetrcId: metrcItem.StrainId
        });
    }

    let item = await Item.create({
        id: uuid.v4(),
        storeId: store.id,

        MetrcId: metrcItem.ProductId || metrcItem.Id,
        name: metrcItem.ProductName || metrcItem.Name,

        UnitOfMeasureName: metrcItem.UnitOfMeasureName,
        UnitOfMeasureAbbreviation: metrcItem.UnitOfMeasureAbbreviation,

        productTypeId: productType.id,
        strainId: strain.id
    });

    let product = await Product.create({
        id: uuid.v4(),
        storeId: store.id,
        name: item.name,
        description: 'Imported from Metrc',
        image: `/assets/img/prod${Math.floor(Math.random() * 4) + 1}.jpg`,
        inventoryType: productType.unitOfMeasure === 'gram' ? 'weight' : 'each' ,
        itemId: item.id,
        productTypeId: productType.id
    });

    let productVariation = await product.createProductVariation({
        id: uuid.v4(),
        storeId: store.id,
        name: '1' + (productType.unitOfMeasure === 'gram' ? 'g' : 'ea'),
        description: 'Default variation',
        price: null,
        quantity: 1,
    });

    await productVariation.addItem(item, {quantity: 1});

    createdItems[item.MetrcId] = {
        item,
        strain,
        product,
        productVariation
    };

    return createdItems[item.MetrcId];
};