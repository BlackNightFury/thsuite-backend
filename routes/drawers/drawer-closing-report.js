const {User, Device, Store, Drawer, DrawerRemoval, Receipt, LineItem, Transaction, TransactionTax, Tax, Product, ProductType} = alias.require('@models');
const moment = require('moment');

module.exports = async function({userId, deviceId, selectedDate}){

    let store = await Store.findOne();

    let where = {
        createdAt: { $between: [ moment.tz(selectedDate, store.timeZone).startOf('day').utc().format(), moment.tz(selectedDate, store.timeZone).endOf('day').utc().format() ] }
    };

    if (userId) {
        where.userId = userId
    }

    if (deviceId) {
        where.deviceId = deviceId
    }

    let drawers = await Drawer.findAll({
        order: [ [ 'createdAt', 'DESC' ] ],
        where: where,
        attributes: ['id', 'createdAt', 'closedAt'],
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: User,
                as: "ClosedByUser",
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Device,
                attributes: ['id', 'name']
            },
            {
                model: DrawerRemoval,
                attributes: ['id', 'userId', 'removedAmount'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            },
            {
                model: Receipt,
                attributes: ['id', 'drawerId', 'paymentMethod'],
                include: [
                    {
                        model: LineItem,
                        attributes: ['id', 'receiptId', 'quantity'],
                        include: [
                            {
                                model: Transaction,
                                attributes: ['id', 'lineItemId', 'TotalPrice', 'isReturn'],
                                include: [
                                    {
                                        model: TransactionTax,
                                        include: [
                                            {
                                                model: Tax,
                                                attributes: ['name']
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                model: Product,
                                attributes: ['id', 'productTypeId'],
                                include: [
                                    {
                                        model: ProductType,
                                        attributes: ['name', 'category']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    let drawerAggregates = [];

    let allDrawers = {
        userName: 'All Users',
        deviceName: 'All Devices',

        count: 0,

        total: 0,
        totalTaxes: 0,
        totalWithoutTaxes: 0,

        totalByProductType: {},
        totalByPaymentType: {},
        totalByCannabisType: {},
        totalByTax: {},
        removalsByUser: {},

        totalDrawerRemovalsCount: 0,
        totalDrawerRemovalsSum: 0,
    };

    for(let drawer of drawers) {

        let total = 0;
        let totalTaxes = 0;
        let totalWithoutTaxes = 0;

        let totalByProductType = {};
        let totalByPaymentType = {};
        let totalByCannabisType = {};
        let totalByTax = {};
        let removalsByUser = {};
        let totalDrawerRemovalsCount = 0;
        let totalDrawerRemovalsSum = 0;

        for(let receipt of drawer.Receipts) {

            let receiptTotal = 0;

            for(let lineItem of receipt.LineItems) {

                let lineItemTotal = 0;
                let lineItemTaxes = 0;
                let lineItemIsReturn = false;
                for(let transaction of lineItem.Transactions) {
                    lineItemIsReturn = !!transaction.isReturn;
                    let taxes = 0;
                    for(let tax of transaction.TransactionTaxes) {
                        if (tax.Tax) {
                            taxes += tax.amount;

                            if(!totalByTax[tax.Tax.name]) {
                                totalByTax[tax.Tax.name] = {
                                    count: 0,
                                    amount: 0
                                }
                            }

                            totalByTax[tax.Tax.name].count += !transaction.isReturn ? lineItem.quantity : 0;
                            totalByTax[tax.Tax.name].amount += tax.amount;

                            if(!allDrawers.totalByTax[tax.Tax.name]) {
                                allDrawers.totalByTax[tax.Tax.name] = {
                                    count: 0,
                                    amount: 0
                                }
                            }

                            allDrawers.totalByTax[tax.Tax.name].count += !transaction.isReturn ? lineItem.quantity : 0;
                            allDrawers.totalByTax[tax.Tax.name].amount += tax.amount;
                        }

                    }

                    if (receipt.id == '640d7048-32a8-41bf-9e9d-e0428d38a88f') {
                        console.log('ITEM', transaction.dataValues, taxes);
                    }
                    if (transaction.isReturn) {
                        lineItemTotal += transaction.TotalPrice;
                        lineItemTaxes += taxes;
                    } else {
                        lineItemTotal += transaction.TotalPrice;
                        lineItemTaxes += taxes;
                    }

                }

                total += lineItemTotal;
                totalTaxes += lineItemTaxes;
                totalWithoutTaxes += lineItemTotal - lineItemTaxes;

                allDrawers.total += lineItemTotal;
                allDrawers.totalTaxes += lineItemTaxes;
                allDrawers.totalWithoutTaxes += lineItemTotal - lineItemTaxes;

                if(!totalByProductType[lineItem.Product.ProductType.name]) {
                    totalByProductType[lineItem.Product.ProductType.name] = {
                        count: 0,
                        amount: 0
                    }
                }

                totalByProductType[lineItem.Product.ProductType.name].count += (lineItemIsReturn ? -1 : 1) * lineItem.quantity;
                totalByProductType[lineItem.Product.ProductType.name].amount += lineItemTotal;


                if(!allDrawers.totalByProductType[lineItem.Product.ProductType.name]) {
                    allDrawers.totalByProductType[lineItem.Product.ProductType.name] = {
                        count: 0,
                        amount: 0
                    }
                }

                allDrawers.totalByProductType[lineItem.Product.ProductType.name].count += (lineItemIsReturn ? -1 : 1) * lineItem.quantity;
                allDrawers.totalByProductType[lineItem.Product.ProductType.name].amount += lineItemTotal;

                if(!totalByCannabisType[lineItem.Product.ProductType.category]) {
                    totalByCannabisType[lineItem.Product.ProductType.category] = {
                        count: 0,
                        amount: 0
                    }
                }

                totalByCannabisType[lineItem.Product.ProductType.category].count += !lineItemIsReturn ? lineItem.quantity : 0;
                totalByCannabisType[lineItem.Product.ProductType.category].amount += lineItemTaxes;


                if(!allDrawers.totalByCannabisType[lineItem.Product.ProductType.category]) {
                    allDrawers.totalByCannabisType[lineItem.Product.ProductType.category] = {
                        count: 0,
                        amount: 0
                    }
                }

                allDrawers.totalByCannabisType[lineItem.Product.ProductType.category].count += !lineItemIsReturn ? lineItem.quantity : 0;
                allDrawers.totalByCannabisType[lineItem.Product.ProductType.category].amount += lineItemTaxes;


                receiptTotal += lineItemTotal;
            }


            if(!totalByPaymentType[receipt.paymentMethod]) {
                totalByPaymentType[receipt.paymentMethod] = {
                    count: 0,
                    amount: 0
                }
            }

            totalByPaymentType[receipt.paymentMethod].count += 1;
            totalByPaymentType[receipt.paymentMethod].amount += receiptTotal;


            if(!allDrawers.totalByPaymentType[receipt.paymentMethod]) {
                allDrawers.totalByPaymentType[receipt.paymentMethod] = {
                    count: 0,
                    amount: 0
                }
            }

            allDrawers.totalByPaymentType[receipt.paymentMethod].count += 1;
            allDrawers.totalByPaymentType[receipt.paymentMethod].amount += receiptTotal;
        }

        allDrawers.count += drawer.Receipts.length;

        totalDrawerRemovalsCount = drawer.DrawerRemovals.length;
        totalDrawerRemovalsSum = drawer.DrawerRemovals.reduce((total, removal) => total+removal.removedAmount, 0);

        allDrawers.totalDrawerRemovalsCount += totalDrawerRemovalsCount;
        allDrawers.totalDrawerRemovalsSum += totalDrawerRemovalsSum;

        for (const drawerRemoval of drawer.DrawerRemovals) {
            const name = `${drawerRemoval.User.firstName} ${drawerRemoval.User.lastName}`;
            if (!removalsByUser[name]) {
                removalsByUser[name] = {
                    totalDrawerRemovalsCount: 0,
                    totalDrawerRemovalsSum: 0
                }
            }

            removalsByUser[name].totalDrawerRemovalsCount += 1;
            removalsByUser[name].totalDrawerRemovalsSum += drawerRemoval.removedAmount;
        }

        const removalsByUserArray = [];
        for (const name in removalsByUser) {
            removalsByUserArray.push({
                name,
                total: removalsByUser[name]
            });
        }

        let totalByProductTypeArray = [];
        for(let name in totalByProductType) {
            totalByProductTypeArray.push({
                name,
                total: totalByProductType[name]
            })
        }

        let totalByPaymentTypeArray = [];
        for(let name in totalByPaymentType) {
            totalByPaymentTypeArray.push({
                name,
                total: totalByPaymentType[name]
            })
        }

        let totalByCannabisTypeArray = [];
        for(let name in totalByCannabisType) {
            totalByCannabisTypeArray.push({
                name,
                total: totalByCannabisType[name]
            })
        }

        let totalByTaxArray = [];
        for(let name in totalByTax) {
            totalByTaxArray.push({
                name,
                total: totalByTax[name]
            })
        }

        drawerAggregates.push({
            userName: drawer.User ? (drawer.User.firstName + ' ' + drawer.User.lastName) : "None",
            openedAt: drawer.createdAt,
            closedAt: drawer.closedAt,
            closedByUserName: drawer.ClosedByUser ? (drawer.ClosedByUser.firstName + ' ' + drawer.ClosedByUser.lastName) : "None",
            // deviceName: drawer.Device.name,

            count: drawer.Receipts.length,

            total,
            totalTaxes,
            totalWithoutTaxes,

            totalByProductType: totalByProductTypeArray,
            totalByPaymentType: totalByPaymentTypeArray,
            totalByCannabisType: totalByCannabisTypeArray,
            totalByTax: totalByTaxArray,
            removalsByUser: removalsByUserArray,

            totalDrawerRemovalsCount: totalDrawerRemovalsCount,
            totalDrawerRemovalsSum: totalDrawerRemovalsSum,
        });
    }

    let removalsByUserArray = [];
    for(let name in allDrawers.removalsByUser) {
        removalsByUserArray.push({
            name,
            total: allDrawers.removalsByUser[name]
        })
    }
    allDrawers.removalsByUser = removalsByUserArray

    let totalByProductTypeArray = [];
    for(let name in allDrawers.totalByProductType) {
        totalByProductTypeArray.push({
            name,
            total: allDrawers.totalByProductType[name]
        })
    }
    allDrawers.totalByProductType = totalByProductTypeArray

    let totalByPaymentTypeArray = [];
    for(let name in allDrawers.totalByPaymentType) {
        totalByPaymentTypeArray.push({
            name,
            total: allDrawers.totalByPaymentType[name]
        })
    }
    allDrawers.totalByPaymentType = totalByPaymentTypeArray;

    let totalByCannabisTypeArray = [];
    for(let name in allDrawers.totalByCannabisType) {
        totalByCannabisTypeArray.push({
            name,
            total: allDrawers.totalByCannabisType[name]
        })
    }
    allDrawers.totalByCannabisType = totalByCannabisTypeArray

    let totalByTaxArray = [];
    for(let name in allDrawers.totalByTax) {
        totalByTaxArray.push({
            name,
            total: allDrawers.totalByTax[name]
        })
    }
    allDrawers.totalByTax = totalByTaxArray;


    return {
        drawerAggregates,
        allDrawers
    }
}
