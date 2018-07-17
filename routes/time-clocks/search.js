const { TimeClock } = alias.require('@models');


module.exports = async function(args) {

    let include = [];

    let order = [['clockIn', 'DESC']];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let where = {};
    if(args.userId) {
        where.userId = args.userId;
    }

    let {count, rows} = await TimeClock.findAndCountAll({
        attributes: ['id'],

        where,

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