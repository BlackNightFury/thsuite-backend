
const models = alias.require('@models');
const { Item, ProductType, Supplier, Package, sequelize } = models;
const Common = require('./.Common');

const WeightUnitOfMeasures = require('../../utils/WeightUnitOfMeasures');

module.exports = async function(args) {

    console.log("Weight Unit Of Measures: [ " + WeightUnitOfMeasures + " ]");

    let productTypeInclude = {
        model: ProductType,
        attributes: []
    };

    let itemWhere = {
        name: {$like: `%${args.query}%`}
    };

    let supplierInclude = {
        model: Supplier,
        attributes: []
    };

    if(args.cannabisCategory) {
        const categoryMap = {
            all: '',
            flower: 'Buds',
            shake: 'ShakeTrim',
            concentrate: 'Concentrate',
            edible: 'InfusedEdible',
            infused: 'InfusedNonEdible',
            plants: 'Plants',
            other: 'Other',
            'non-cannabis': 'NonCannabis'
        };

        productTypeInclude.where = {
            cannabisCategory: categoryMap[args.cannabisCategory]
        };
    }

    if(args.productTypeId){
        if(productTypeInclude.where){
            productTypeInclude.where.id = args.productTypeId
        }else{
            productTypeInclude.where = {
                id: args.productTypeId
            }
        }
    }

    if(args.measurementType && args.measurementType != 'all') {
        if (args.measurementType == 'each') itemWhere.UnitOfMeasureName = 'Each';
        else if (args.measurementType == 'weight') itemWhere.UnitOfMeasureName = {$in: WeightUnitOfMeasures};
    }

    if(args.supplierId){
        supplierInclude.where = {
            id: args.supplierId
        }
    }

    itemWhere = Common.AddStockClause( args.stock, itemWhere );

    let order = [];
    if(args.sortBy && args.sortBy.sortBy) {
        if(args.sortBy.sortBy === 'Quantity') {
            order = [
                [sequelize.literal('(SELECT IFNULL(SUM(`Quantity`), 0) FROM `packages` WHERE itemId = `Item`.`id`)'), args.sortBy.direction]
            ];
        }
        else {
            order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
            order.push(args.sortBy.direction);

            order = [order];
        }
    }

    if(!order.length){
        order = [['name', 'ASC']]
    }


    let {count, rows} = await Item.findAndCountAll({
        attributes: ['id'],

        where: itemWhere,
        include: [
            productTypeInclude,
            supplierInclude
        ],

        order: order,
        // raw: true,
        // group: ['Item.id'],
        logging: console.log,
        limit: 12,
        offset: args.page * 12
    });

    return {
        objects: rows.map(p => p.id),
        numPages: Math.ceil(count / 12)
    }
};
