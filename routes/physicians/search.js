const models = alias.require('@models');

module.exports = async function(args) {
    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let {count, rows} = await models.Physician.findAndCountAll({
        attributes: ['id'],

        where: {
            $or: {
                firstName: {$like: `%${args.query}%`},
                lastName: {$like: `%${args.query}%`},
            }
        },

        order: order,

        limit: 12,
        offset: args.page * 12,
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
}
