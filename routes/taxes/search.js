const models = alias.require('@models');
const { Tax } = models;


module.exports = async function(args) {

    let include = [];

    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let {count, rows} = await Tax.findAndCountAll({
        attributes: ['id'],

        where: {
            name: {$like: `%${args.query}%`}
        },
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