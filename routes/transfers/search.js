
const Metrc = require('../../lib/metrc/index');
const models = alias.require('@models');
const { Transfer, Delivery, DeliveryPackage, Package, Supplier, sequlize} = models;

module.exports = async function(args) {


    let where = {};
    let order = [];

    if(args.supplierId){
        where.supplierId = args.supplierId;
    }

    if(args.type) {
        where.type = args.type;
    }

    if(args.sortBy && args.sortBy.sortBy) {
        order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
        order.push(args.sortBy.direction);

        order = [order];
    }


    let {count, rows} = await Transfer.findAndCountAll({

        attributes: ['id'],
        where: where,
        include: [],
        order: order,
        limit: 12,
        offset: args.page * 12,
        logging: console.log

    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }

};