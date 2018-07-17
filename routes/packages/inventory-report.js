const {Package, Item, ProductVariationItem, ProductVariation, Product, ProductType, Supplier, sequelize } = alias.require('@models');
const moment = require('moment');

module.exports = async function(args) {

    let startDate = args.dates.start 
    let endDate = args.dates.end

    let packageIds = [];

    //Product
    if(args.inventoryEntity && !args.productId && !args.productTypeId && !args.packageId && !args.supplierId){
        //Need to display all packages
        let packages = await Package.findAll({
            attributes: ['id']
        });

        for(let _package of packages) {
            packageIds.push(_package.id);
        }
    } else if(args.inventoryEntity && args.packageId) {

        packageIds.push(args.packageId);

    } else if(args.inventoryEntity && args.productId) {
        let packages = await Package.findAll({
            attributes: ['id'],
            include: [
                {
                    model: Item,
                    attributes: [],
                    include: [
                        {
                            model: ProductVariationItem,
                            attributes: [],
                            include: [
                                {
                                    model: ProductVariation,
                                    attributes: [],
                                    include: [
                                        {
                                            model: Product,
                                            attributes:[],
                                            where: {
                                                id: args.productId
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        for(let _package of packages) {
            packageIds.push(_package.id);
        }
    } else if(args.inventoryEntity && args.productTypeId){

        let packages = await Package.findAll({
            attributes: ['id'],
            include: [
                {
                    model: Item,
                    attributes: [],
                    include: [
                        {
                            model: ProductVariationItem,
                            attributes: [],
                            include: [
                                {
                                    model: ProductVariation,
                                    attributes: [],
                                    include: [
                                        {
                                            model: Product,
                                            attributes:[],
                                            where: {
                                                productTypeId: args.productTypeId
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        for(let _package of packages) {
            packageIds.push(_package.id);
        }
    } else if(args.inventoryEntity && args.supplierId){
        let packages = await Package.findAll({
            attributes: ['id'],
            where: {
                supplierId: args.supplierId
            }
        });

        for(let _package of packages) {
            packageIds.push(_package.id);
        }
    }


    if(packageIds.length) {
        //Query for init quantity
        let initQuantitySql = `
            SELECT id, wholesalePrice, ReceivedQuantity
            FROM packages
            WHERE id IN (?)
        `;

        let quantity = await
        sequelize.query(initQuantitySql, {
            replacements: [packageIds],
            type: sequelize.QueryTypes.SELECT
        });

        let initQuantity = 0;
        let initValue = 0;
        let unitPrices = {};

        for(let _package of quantity){
            initQuantity += _package.ReceivedQuantity;
            initValue += _package.wholesalePrice;
            if(_package.ReceivedQuantity){
                unitPrices[_package.id] = _package.wholesalePrice / _package.ReceivedQuantity;
            }else {
                unitPrices[_package.id] = 0;
            }
        }

        let soldPriorSql = `
            SELECT packageId, sum(QuantitySold) as sold
            FROM transactions
            WHERE packageId IN (?) AND transactionDate < "${startDate}"
            GROUP BY packageId
        `;

        let sold = await
        sequelize.query(soldPriorSql, {
            replacements: [packageIds],
            type: sequelize.QueryTypes.SELECT,
        });

        let soldPriorQuantity = 0;
        let soldPriorValue = 0;

        for(let _package of sold) {
            soldPriorQuantity += _package.sold;
            soldPriorValue += (unitPrices[_package.packageId] * _package.sold);
        }

        let periodStartQuantity = initQuantity - soldPriorQuantity;
        let periodStartValue = initValue - soldPriorValue;

        let soldEndDate = moment.utc(endDate).add(1, 'day').format("YYYY-MM-DD 00:00:00");

        let sales;

        if(args.viewType == 'value'){

            let soldDuringSql = `
                SELECT packageId, transactionDate, QuantitySold as sold
                FROM transactions
                WHERE transactionDate >= "${startDate}" AND transactionDate <= "${soldEndDate}" AND packageId IN (?)
            `;

            sales = await
            sequelize.query(soldDuringSql, {
                replacements: [packageIds],
                type: sequelize.QueryTypes.SELECT
            });

            for(let sale of sales) {
                //Get package ID, calc sold * unit price
                let valueSold = (unitPrices[sale.packageId] * sale.sold);
                sale.value = valueSold;
            }

            let aggregateSales = {};
            for(let sale of sales) {
                const day = moment.utc(sale.transactionDate).tz(args.timeZone).format('YYYY-MM-DD')
                if(!aggregateSales[day]){
                    aggregateSales[day] = {
                        sold: sale.sold,
                        value: sale.value
                    }
                }else{
                    aggregateSales[day].sold += sale.sold;
                    aggregateSales[day].value += sale.value;
                }
            }

            sales = [];

            Object.keys(aggregateSales).forEach(key => {
                let sale = {
                    date: key,
                    sold: aggregateSales[key].sold,
                    value: aggregateSales[key].value
                };

                sales.push(sale);
            });

            let data = [];
            let previousValue = periodStartValue;

            data.push({
                date: moment(startDate).tz(args.timeZone).format('YYYY-MM-DD'),
                value: periodStartValue
            });

            let startMoment = moment(startDate).tz(args.timeZone)

            let endMoment = moment(endDate).tz(args.timeZone);

            let dayDiff = endMoment.diff(startMoment, 'days');

            let currMoment = moment(startDate).tz(args.timeZone)

            for (let i = 1; i <= dayDiff; i++) {
                currMoment.add(1, 'day')
                //Check if this day exists in pulled data
                let date;
                let value;
                let found = false;
                for (let daySales of sales) {
                    let thisMoment = daySales.date
                    if (currMoment.format('YYYY-MM-DD') === thisMoment ) {
                        //This day exists, add to data
                        found = true;
                        date = thisMoment
                        value = previousValue - daySales.value;
                        continue;
                    }
                }
                if (!found) {
                    date = currMoment.format("YYYY-MM-DD");
                    value = previousValue
                }

                data.push({
                    date: date,
                    value: value
                });

                previousValue = value;

            }

            return data;

        } else if(args.viewType == 'stock') {
            let soldDuringSql = `
                SELECT transactionDate, QuantitySold as sold
                FROM transactions
                WHERE transactionDate >= "${startDate}" AND transactionDate <= "${soldEndDate}" AND packageId IN (?)
            `;

            //Now just need to calculate levels of inventory
            sales = await sequelize.query(soldDuringSql, {
                replacements: [packageIds],
                type: sequelize.QueryTypes.SELECT
            });

            let data = [];
            let previousStock = periodStartQuantity;

            data.push({
                date: moment.utc(startDate).tz(args.timeZone).format('YYYY-MM-DD'),
                inventory: periodStartQuantity
            });

            let startMoment = moment(startDate).tz(args.timeZone);

            let endMoment = moment(endDate).tz(args.timeZone);

            let dayDiff = endMoment.diff(startMoment, 'days');

            let currMoment = moment(startDate).tz(args.timeZone);

            for (let i = 1; i <= dayDiff; i++) {
                currMoment.add(1, 'day');
                //Check if this day exists in pulled data
                let date;
                let inventoryLevel;
                let found = false;
                for (let daySales of sales) {
                    let thisMoment = daySales.transactionDate
                    if (currMoment.format('YYYY-MM-DD') === thisMoment) {
                        //This day exists, add to data
                        found = true;
                        date = thisMoment.format("YYYY-MM-DD");
                        inventoryLevel = previousStock - daySales.sold;
                        continue;
                    }
                }
                if (!found) {
                    date = currMoment.format("YYYY-MM-DD");
                    inventoryLevel = previousStock
                }

                data.push({
                    date: date,
                    inventory: inventoryLevel
                });

                previousStock = inventoryLevel;

            }

            return data;


        }else{
            return [];
        }

    } else {
        return [];
    }


}
