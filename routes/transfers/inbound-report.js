const models = alias.require('@models');
const { Transfer, Delivery, DeliveryPackage, Package, Product, ProductVariation, Item, ProductVariationItem, ProductType, sequelize} = models;
const moment = require('moment');
require('moment-timezone')

module.exports = async function(args) {

    let startDate = args.dates.start
    let endDate = args.dates.end

    if(startDate && endDate){

        let type;

        let transfers;

        if(args.inventoryEntity == 'productId' || args.inventoryEntity == 'productTypeId'){
            let packages;
            let packageIds = [];

            let itemInclude = {
                model: Item,
                attributes: [],
                include: []
            };

            let productVariationItemInclude = {
                model: ProductVariationItem,
                attributes: [],
                include: []
            };

            let productVariationInclude = {
                model: ProductVariation,
                attributes: [],
                include: []
            };

            //Get packageIds
            if(args.productId) {

                //Get this product's product type
                let product = await Product.findOne({
                    where:{
                        id: args.productId
                    }
                });

                let productType = await ProductType.findOne({
                    where: {
                        id: product.productTypeId
                    }
                });

                type = productType.unitOfMeasure == 'gram' ? "Grams" : "Each";

                let productInclude = {
                    model: Product,
                    attributes: [],
                    where: {
                        id: args.productId
                    }
                };

                productVariationInclude.include.push(productInclude);
                productVariationItemInclude.include.push(productVariationInclude);
                itemInclude.include.push(productVariationItemInclude);

                packages = await Package.findAll({
                    attributes: ['id'],
                    include: [
                        itemInclude
                    ]
                });

            } else if(args.productTypeId){

                //Get this product type
                let productType = await ProductType.findOne({
                    where: {
                        id: args.productTypeId
                    }
                });

                type = productType.unitOfMeasure == 'gram' ? "Grams" : "Each";

                let productInclude = {
                    model: Product,
                    attributes: [],
                    where: {
                        productTypeId: args.productTypeId
                    }
                };

                productVariationInclude.include.push(productInclude);
                productVariationItemInclude.include.push(productVariationInclude);
                itemInclude.include.push(productVariationItemInclude);

                packages = await Package.findAll({
                    attributes: ['id'],
                    include: [
                        itemInclude
                    ]
                });

            }else{
                //No specific filter, all packages
                packages = await Package.findAll({
                    attributes: ['id']
                });

            }

            for(let _package of packages) {
                packageIds.push(_package.id);
            }

            //Use this if general product or product type filter or any specific product, product type filter is applied
            if(packageIds.length) {
                let sql = `
                SELECT Transfer.id as transferId, Transfer.ReceivedDateTime, SUM(DeliveryPackage.ReceivedQuantity) as transferQuantity, DeliveryPackage.ReceivedUnitOfMeasureName as unit, COUNT(1) as packageCount
                FROM transfers as Transfer
                INNER JOIN deliveries as Delivery ON Delivery.transferId = Transfer.id
                INNER JOIN delivery_packages as DeliveryPackage ON DeliveryPackage.deliveryId = Delivery.id
                WHERE Transfer.type='incoming' AND (Transfer.ReceivedDateTime >= '${startDate}' AND Transfer.ReceivedDateTime <= '${endDate}') AND DeliveryPackage.packageId IN (?)
                GROUP BY Transfer.id, DeliveryPackage.ReceivedUnitOfMeasureName
            `;

                transfers = await sequelize.query(sql, {
                    replacements: [packageIds],
                    type: sequelize.QueryTypes.SELECT
                });
            }else{
                transfers = [];
            }


        } else if(!args.inventoryEntity || (args.inventoryEntity == 'supplierId' && !args.supplierId)) {
            //Use this if no filter, or general supplier filter
            let sql = `
                SELECT Transfer.id as transferId, Transfer.ReceivedDateTime, SUM(DeliveryPackage.ReceivedQuantity) as transferQuantity, DeliveryPackage.ReceivedUnitOfMeasureName as unit, COUNT(1) as packageCount
                FROM transfers as Transfer
                INNER JOIN deliveries as Delivery ON Delivery.transferId = Transfer.id
                INNER JOIN delivery_packages as DeliveryPackage ON DeliveryPackage.deliveryId = Delivery.id
                WHERE Transfer.type='incoming' AND (Transfer.ReceivedDateTime >= '${startDate}' AND Transfer.ReceivedDateTime <= '${endDate}')
                GROUP BY Transfer.id,  DeliveryPackage.ReceivedUnitOfMeasureName
            `;

            transfers = await sequelize.query(sql, {
                type: sequelize.QueryTypes.SELECT
            });

        } else if(args.inventoryEntity == 'supplierId' && args.supplierId) {
            //Use this for specific supplier filter
            let sql = `
                SELECT Transfer.id as transferId, Transfer.ReceivedDateTime, SUM(DeliveryPackage.ReceivedQuantity) as transferQuantity, DeliveryPackage.ReceivedUnitOfMeasureName as unit, COUNT(1) as packageCount
                FROM transfers as Transfer
                INNER JOIN deliveries as Delivery ON Delivery.transferId = Transfer.id
                INNER JOIN delivery_packages as DeliveryPackage ON DeliveryPackage.deliveryId = Delivery.id
                WHERE Transfer.type='incoming' AND (Transfer.ReceivedDateTime >= '${startDate}' AND Transfer.ReceivedDateTime <= '${endDate}') AND Transfer.supplierId = '${args.supplierId}'
                GROUP BY Transfer.id,  DeliveryPackage.ReceivedUnitOfMeasureName
            `;

            transfers = await sequelize.query(sql, {
                type: sequelize.QueryTypes.SELECT
            });

        } else {
            return [];
        }

        let dateData = [];

        if(args.viewType == 'volume'){
            transfers.forEach(transfer => {
                let dataPoint = {
                    date: moment(transfer.ReceivedDateTime).tz(args.timeZone).format("YYYY-MM-DD"),
                    value: transfer.packageCount,
                    unit: ''
                };

                dateData.push(dataPoint);

            });
        } else if(args.viewType == 'quantity'){
            transfers.forEach(transfer => {
                let dataPoint = {
                    date: moment(transfer.ReceivedDateTime).tz(args.timeZone).format("YYYY-MM-DD"),
                    value: transfer.transferQuantity,
                    unit: transfer.unit
                };

                dateData.push(dataPoint);
            })

        } else {
            return [];
        }

        //Do date consolidation here
        let aggregatedDates = {};
        dateData.forEach(dataPoint => {
            if(!aggregatedDates[dataPoint.date]){
                if(dataPoint.unit){
                    if(!type) type = dataPoint.unit;
                    aggregatedDates[dataPoint.date] = {Each: 0, Grams: 0, type: dataPoint.unit};
                    aggregatedDates[dataPoint.date][dataPoint.unit] = dataPoint.value;
                }else{
                    aggregatedDates[dataPoint.date] = {};
                    aggregatedDates[dataPoint.date]['count'] = dataPoint.value;
                }
            } else {
                //
                if(dataPoint.unit){
                    if(!type) type = dataPoint.unit;
                    aggregatedDates[dataPoint.date]['type'] = dataPoint.unit;
                    if(aggregatedDates[dataPoint.date][dataPoint.unit] == undefined){
                        aggregatedDates[dataPoint.date][dataPoint.unit] = dataPoint.value;
                    }else{
                        aggregatedDates[dataPoint.date][dataPoint.unit] += dataPoint.value;
                    }
                }else{
                    aggregatedDates[dataPoint.date]['count'] += dataPoint.value;
                }
            }
        });

        let finalData = [];

        let startMoment = moment(startDate).tz(args.timeZone)

        let endMoment = moment(endDate).tz(args.timeZone);

        let dayDiff = endMoment.diff(startMoment, 'days');

        let currMoment = moment(startDate).tz(args.timeZone);

        for (let i = 1; i <= dayDiff+1; i++) {
            //Check if this day exists in pulled data
            let date;
            let value;
            let found = false;
            for (let key of Object.keys(aggregatedDates)) {
                let thisMoment = key;
                if (currMoment.format('YYYY-MM-DD') == thisMoment) {
                    //This day exists, add to data
                    found = true;
                    date = moment(thisMoment).format("YYYY-MM-DD 00:00:00");
                    value = aggregatedDates[key];
                    continue;
                }
            }
            if (!found) {
                date = currMoment.format("YYYY-MM-DD 00:00:00");
                if(args.viewType == 'quantity'){
                    value = {Each: 0, Grams: 0, type: type};
                }else if(args.viewType == 'volume'){
                    value = {count: 0};
                }
            }

            finalData.push({
                date: date,
                value: value
            });

            currMoment.add(1, 'day');
        }

        return finalData;
    } else {
        return [];
    }
}
