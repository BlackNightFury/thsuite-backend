const models = alias.require('@models')
const { Item, Package, PackagePriceAdjustment, PurchaseOrder, Product, DeliveryPackage, sequelize } = models
const moment = require('moment')

module.exports = class Common {

    static async handleSearch(args) {
        let include = [
            { model: Item, required: true, include: [ { model: Product, required: true} ] },
            { model: PackagePriceAdjustment },
            { model: PurchaseOrder }
        ]

        let where = { }

        let order = [];
        if(args.sortBy && args.sortBy.sortBy) {
            if(args.sortBy.sortBy == 'ReceivedDateTime' && args.sortBy.direction == "desc"){
                order = [sequelize.literal(`IFNULL(ReceivedDateTime, 9999-99-99)`)];
            }else{
                order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
            }
            order.push(args.sortBy.direction);

            order = [order];
        }

        if(args.query) {
            //where.Label = {$like: `%${args.query}%`}
		    let $like = `%${args.query}%`
            where['$or'] = {
                [`$Item.Product.name$`]: { $like },
                '$Package.Label$': { $like }
            }
		 }

        if(args.itemId){
            where.itemId = args.itemId;
        }

        if(args.supplierId){
            where.supplierId = args.supplierId;
        }

        if(args.quantity != undefined && args.quantityComparator){

            if(args.quantityComparator == 'gt'){
                where.availableQuantity = {
                    $gt: args.quantity
                };
            }

        }

        if(args.inStock) {
            where.Quantity = {$gt: 0};
        }

        if(args.startDate) {
            where.createdAt = {
                $between: [ args.startDate, args.endDate ],
            }
        }

        if(args.UnitOfMeasureName) {
            where.UnitOfMeasureName = args.UnitOfMeasureName;
        }

        if(args.finishedMode && args.finishedMode == 'hide'){
            where.finishedDate = null;

        }

        if(args.unreceivedMode && args.unreceivedMode == 'hide'){
            where.ReceivedDateTime = {
                $not: null
            };
        }

        if( args.export ) {
            return await Package.findAll( { where, include, order } )
        } else {

            let {count, rows} = await Package.findAndCountAll({
                where: where,
                include: include,

                order,
                limit: 12,
                offset: args.page * 12
            });

            return {
                objects: rows.map(p => p.id),
                numPages: Math.ceil(count / 12)
            }
        }
    }
}
