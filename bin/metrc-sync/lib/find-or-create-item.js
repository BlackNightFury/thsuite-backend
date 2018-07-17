const {Strain, ProductType, Product, ProductVariation, Item, Alert} = alias.require('@models');
const uuid = require('uuid');


module.exports = async function(store, metrcItem) {


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


    let product;
    let productVariation;
    let item = await Item.find({
        where: {
            MetrcId: metrcItem.ProductId || metrcItem.Id
        },
        paranoid: false
    });

    if(!item) {
        let productType = await ProductType.find({
            where: {
                name: metrcItem.ProductCategoryName
            }
        });

        item = await Item.create({
            id: uuid.v4(),
            storeId: store.id,

            MetrcId: metrcItem.ProductId || metrcItem.Id,
            name: metrcItem.ProductName || metrcItem.Name,

            UnitOfMeasureName: metrcItem.UnitOfMeasureName,
            UnitOfMeasureAbbreviation: metrcItem.UnitOfMeasureAbbreviation,

            productTypeId: productType.id,
            strainId: strain.id
        });

        product = await Product.create({
            id: uuid.v4(),
            storeId: store.id,
            name: item.name,
            description: 'Imported from Metrc',
            image: `/assets/img/prod${Math.floor(Math.random() * 4) + 1}.jpg`,
            inventoryType: productType.unitOfMeasure === 'gram' ? 'weight' : 'each' ,
            itemId: item.id,
            productTypeId: productType.id
        });

        productVariation = await product.createProductVariation({
            id: uuid.v4(),
            storeId: store.id,
            name: '1' + (productType.unitOfMeasure === 'gram' ? 'g' : 'ea'),
            description: 'Default variation',
            price: null,
            quantity: 1,
        });

        await productVariation.addItem(item, {quantity: 1});

        if (productType.cannabisCategory === 'Buds' && productType.unitOfMeasure === 'gram') {
            const variations = [3.5, 7, 14, 28];

            for (let variation of variations) {

                let productVariation = await product.createProductVariation({
                    id: uuid.v4(),
                    storeId: store.id,
                    name: variation + (productType.unitOfMeasure === 'gram' ? 'g' : 'ea'),
                    description: 'Default variation',
                    price: null,
                    quantity: variation,
                });

                await productVariation.addItem(item, {quantity: variation});
            }
        }

        if ( item.MetrcId > 0 && item.UnitOfMeasureName === 'Each' // Check if cannabis, each-based item
                && (!item.thcWeight || item.thcWeight == 0) ) { // Check if it's thcWeight is acceptable value (i.e. exists && > 0)
            await Alert.create({
                title: 'Set THC Weight',
                description: `${item.name} is an each based cannabis item that must have a non-zero THC Weight`,
                url: `/admin/inventory/items/edit/${item.id}`,
                type: 'item-missing-thc-weight',
                entityId: item.id
            })
        };
    }
    else {


        if(item.deletedAt !== null){
            await item.restore();
        }


        product = await Product.find({
            where: {
                itemId: item.id
            },
            paranoid: false
        });

        if(product.deletedAt !== null){
            await product.restore();
        }

        productVariation = await ProductVariation.find({
            where: {
                productId: product.id
            },
            paranoid: false
        });

        if(productVariation.deletedAt !== null){
            await productVariation.restore();
        }

    }

    return {
        item,
        strain,
        product,
        productVariation
    };
};
