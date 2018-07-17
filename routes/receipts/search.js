const models = alias.require('@models');
const { Receipt } =  models;
const moment = require('moment')

module.exports = async function(args) {
    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }

    let where = { };

    if( args.startDate ) {
        where.createdAt = {
            $between: [
                moment.utc(args.startDate).toDate(),
                moment.utc(args.endDate).toDate()
            ]
        }
    }

    if( args.query.length ) {
        where.barcode = { $like: `%${args.query}%` }
    }

    const {count, rows} = await Receipt.findAndCountAll({
        attributes: ['id'],
        where,
        order,

        limit: 12,
        offset: args.page * 12,
        paranoid: !(args.includeDeleted),
        logging: console.log
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};