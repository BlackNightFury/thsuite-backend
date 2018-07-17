
const models = alias.require('@models');
const { Product, ProductType,  sequelize} =  models;


module.exports = async function(args) {

    let productTypeInclude = {
        model: ProductType,
        attributes: []
    };


    let productWhere = {
        name: {$like: `%${args.query}%`}
    }

    let order = [];

    if(args.cannabisCategory) {
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

        productTypeInclude.where = {
            cannabisCategory: categoryMap[args.cannabisCategory]
        };
    }

    if(args.supplierId) {

        productWhere = sequelize.and(
            {
                name: {$like: `%${args.query}%`}
            },

            sequelize.literal(`
                EXISTS (
                    SELECT product_variations.id
                    FROM product_variations
                    INNER JOIN product_variation_items ON product_variation_items.productVariationId = product_variations.id
                    INNER JOIN items ON product_variation_items.itemId = items.id
                    WHERE product_variations.productId = Product.id AND items.supplierId = ${sequelize.getQueryInterface().escape(args.supplierId)}
                )
            `)
        )

    }

    if(args.productTypeId){
        if(productTypeInclude.where){
            productTypeInclude.where.id = args.productTypeId
        }else{
            productTypeInclude.where = {
                id: args.productTypeId
            }
        }

    }

    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }


    let {count, rows} = await Product.findAndCountAll({
        attributes: ['id', 'productTypeId'],

        where: productWhere,
        include: [
            productTypeInclude,
        ],

        order: order,

        limit: 12,
        offset: args.page * 12

    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};