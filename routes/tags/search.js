const models = alias.require('@models');
const { Tag,  sequelize} =  models;


module.exports = async function(args) {

    let order;

   if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let {count, rows} = await Tag.findAndCountAll({
        attributes: ['id'],

        where: {
            storeId: args.storeId,
            value: { $like: `%${args.query}%` }
        },

        order: order,

        limit: 12,
        offset: args.page * 12
    });

    return {
        objects: rows.map( tag => tag.id),
        numPages: Math.ceil(count / 12)
    }
};
