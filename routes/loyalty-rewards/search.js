const { LoyaltyReward } = alias.require('@models');


module.exports = async function(args) {

    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let where = {
        name: {$like: `%${args.query}%`}
    };

    if(!Number.isNaN(parseInt(args.maxPoints))) {
        where.points = {$lte: args.maxPoints}
    }


    let {count, rows} = await LoyaltyReward.findAndCountAll({
        attributes: ['id'],

        where: where,

        order: order,

        limit: 12,
        offset: args.page * 12
    });

    return {
        objects: rows.map(r => r.get({plain: true})).map(r => r.id),
        numPages: Math.ceil(count / 12)
    }
};