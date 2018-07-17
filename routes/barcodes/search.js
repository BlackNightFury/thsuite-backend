const { Barcode, ProductVariation, Product, ProductType, Package } = alias.require('@models');
const models = alias.require('@models');

module.exports = async function(args) {

    console.log(args);

    let productVariationInclude = {model: ProductVariation, attributes: ['productId'], required: true, logging: console.log};

    let include = [];
    let where = {};

    let order = [['createdAt', 'DESC']];

    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    productVariationInclude.include = [
        {
            model: Product,
            attributes: ['name', 'productTypeId'],
            required: true,
            include: {
                model: ProductType,
                attributes: ['cannabisCategory']
            }
        }
    ];

    if(args.query){
		let $like = `%${args.query}%`

        where['$or'] = {
            [`$ProductVariation.Product.name$`]: { $like },
            '$Barcode.barcode$': { $like }
		}
    }

    if(args.toggleTHC && args.toggleTHC == 'cannabis'){
        where['$ProductVariation.Product.ProductType.category$'] = 'cannabis';
    } else if (args.toggleTHC && args.toggleTHC == 'non-cannabis' ) {
        where['$ProductVariation.Product.ProductType.category$'] = 'non-cannabis';
    }

    include.push(productVariationInclude);

    let {count, rows} = await Barcode.findAndCountAll({
        attributes: ['id', 'createdAt'],

        where: where,
        include: include,

        limit: 12,
        offset: args.page * 12,
        order: order,
        logging: console.log
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};
