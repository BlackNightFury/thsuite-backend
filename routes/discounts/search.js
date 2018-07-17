
const models = alias.require('@models');
const { Discount } = models


module.exports = async function(args) {

    let include = [];

    let where = {
        name: {$like: `%${args.query}%`},
        isCustom: false
    };

    // discount entity
    if(args.discountEntity){
        if(args.discountEntity != 'none') {
            where[args.discountEntity] = {
                $ne: null
            }
        }else{
            where['productId'] = null;
            where['productTypeId'] = null;
            where['packageId'] = null;
        }
    }

    // product
    if(args.productId){
        where['productId'] = args.productId;
    }

    //product type
    if(args.productTypeId){
        where['productTypeId'] = args.productTypeId;
    }

    //package
    if(args.packageId){
        where['packageId'] = args.packageId;
    }

    //active
    if(args.status && args.status != 'all'){
        where['isActive'] = args.status == 'on' ? 1 : 0;
    }

    if(args.hasCode) {
        where['isAutomatic'] = false
    }

    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let {count, rows} = await Discount.findAndCountAll({
        attributes: ['id'],

        where: where,
        include: include,
        order: order,

        limit: 12,
        offset: args.page * 12
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};