
const { Barcode, Product, ProductType, ProductVariation, Item, Package, sequelize } = alias.require('@models');

const queryInterface = sequelize.getQueryInterface();

module.exports = async function(args) {

    let productTypeInclude = {
        model: ProductType,
        attributes: [],
        where: {}
    };

    let productInclude = {
        model: Product,
        attributes: [],
        required: true,
        include: [
            productTypeInclude
        ],
        where: {
            name: {$like: `%${args.query}%`}
        }
    };

    let conditions = [];


    if(args.inStock) {
        conditions.push(sequelize.literal(`
            EXISTS (
                SELECT 1 
                FROM product_variation_items
                INNER JOIN packages ON packages.itemId = product_variation_items.itemId
                WHERE product_variation_items.productVariationId = ProductVariation.id AND packages.Quantity > 0
            )
        `));
    }



    if(args.cannabisCategory && args.cannabisCategory !== 'all') {
        const categoryMap = {
            all: '',
            flower: 'Buds',
            shake: 'ShakeTrim',
            concentrate: 'Concentrate',
            edible: 'InfusedEdible',
            infused: 'InfusedNonEdible',
            plants: 'Plants',
            other: 'Other',
            'non-cannabis': 'NonCannabis'
        };

        productTypeInclude.where.cannabisCategory = categoryMap[args.cannabisCategory];
    }

    if(args.supplierId) {
        conditions.push(sequelize.literal(`
            EXISTS (
                SELECT 1 
                FROM product_variation_items
                INNER JOIN items ON product_variation_items.itemId = items.id
                WHERE product_variation_items.productVariationId = ProductVariation.id AND items.supplierId = ${queryInterface.escape(args.supplierId)}
            )
        `));
    }
    if(args.productTypeId) {
        productTypeInclude.where.id = args.productTypeId;
    }
    if(args.productId) {
        productInclude.where.id = args.productId;
    }

    if(args.cannabis && !args.nonCannabis){
        productTypeInclude.where.category = "cannabis"
    }else if(!args.cannabis && args.nonCannabis){
        productTypeInclude.where.category = "non-cannabis"
    }

    let {count, rows} = await ProductVariation.findAndCountAll({
        attributes: ['id'],

        where: {
            $and: conditions,
        },
        include: [
            productInclude
        ],

        limit: 12,
        offset: args.page * 12,

        logging: console.log
    });

    //This is really bad -- was supposed to allow searching for product variation by barcode string but doesn't
    // if( rows.length < 12 ) {
    //     let barcodeRows = await Barcode.findAll({
    //         attributes: ['productVariationId'],
    //         where: { barcode: {$like: `%${args.query}%`}}
    //     })
    //     console.log(barcodeRows.length)
    //     if( barcodeRows ) {
    //         while(rows.length < 12 && barcodeRows.length) {
    //             const barcodeRow = barcodeRows.shift()
    //             console.log(barcodeRow)
    //             rows.push( { id: barcodeRow.productVariationId } )
    //         }
    //         count += barcodeRows.length
    //     }
    // }


    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};
