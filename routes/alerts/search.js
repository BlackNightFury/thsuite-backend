
const models = alias.require('@models');

module.exports = async function(args) {
    /*
    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }
    */

    let order = [['createdAt', 'ASC']];

    let conditions = {};

    if(args.alertType) {
        conditions.type = args.alertType;
    }


    let {count, rows} = await models.Alert.findAndCountAll({
        attributes: ['id'],

        where: conditions,

        order: order,

        limit: 12,
        offset: args.page * 12,
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
}