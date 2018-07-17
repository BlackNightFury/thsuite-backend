
const models = alias.require('@models');

module.exports = async function(args) {
    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let where = {};

    if (!args.field){
        where['$or'] = {
            firstName: {$like: `%${args.query}%`},
            lastName: {$like: `%${args.query}%`}
        };
    } else {
        where[args.field] = {$like: `%${args.query}%`};
    }

    if (args.startDate && args.endDate) {
        where['clockIn'] = { '$between': [args.startDate, args.endDate] };
    } else if (args.startDate) {
        where['clockIn'] = { '$gt': args.startDate };
    } else if (args.endDate) {
        where['clockIn'] = { '$lt': args.endDate };
    }

    let {count, rows} = await models.Visitor.findAndCountAll({
        attributes: ['id'],

        where: where,

        order: order,

        limit: 12,
        offset: args.page * 12,
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
}
