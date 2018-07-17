
const models = alias.require('@models');
const { ProductType } = models;


module.exports = async function(args) {


    let where = {
        name: {$like: `%${args.query}%`}
    };

    if(args.cannabisCategory) {
        where.cannabisCategory = args.cannabisCategory;
    }

    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let {count, rows} = await ProductType.findAndCountAll({
        attributes: ['id'],

        where: where,
        order: order,

        limit: 12,
        offset: args.page * 12
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};