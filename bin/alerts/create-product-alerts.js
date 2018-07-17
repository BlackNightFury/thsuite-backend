require('../../init');

const {ProductVariation, Product, Alert, Item, Package} = alias.require('@models');



(async function() {

    let products = await Product.findAll({
        where: {
            $or: [
                {
                    inventoryType: 'weight',
                    pricingTierId: null
                },
                {
                    inventoryType: 'each'
                }
            ]
        },
        include: [
            {
                model: ProductVariation,
                where: {
                    price: null
                },
                required: false
            },
            {
                model: Item,
                include: [
                    {
                        model: Package,
                        where: {
                            Quantity: {$gt: 0},
                            FinishedDate: null,
                            ArchivedDate: null
                        },
                        required: true
                    }
                ]
            }
        ]
    });

    let alertCount = 0;

    for(let product of products) {

        if(product.inventoryType == 'weight') {
            alertCount++;
            await Alert.create({
                title: 'Set Product Price',
                description: `Product ${product.name} is missing a pricing tier`,
                url: `/admin/inventory/products/edit/${product.id}`,
                type: 'set-product-price',
                entityId: product.id
            });
        }
        else {
            for(let variation of product.ProductVariations) {
                alertCount++;
                await Alert.create({
                    title: 'Set Product Variation Price',
                    description: `Product Variation ${product.name} ${variation.name} is missing a price`,
                    url: `/admin/inventory/products/view/${product.id}/variations/edit/${variation.id}`,
                    type: 'set-product-price',
                    entityId: variation.id
                })
            }
        }


    }


    console.log(`Created ${alertCount} alerts`);

})();