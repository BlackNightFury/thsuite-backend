
const {Store, Drawer, Receipt, LineItem, Device, User, Transaction} = alias.require('@models');
const moment = require('moment');

module.exports = async function(args) {

    let store = await Store.find();
    let drawers = await Drawer.findAll({
        where: {
            createdAt: {
                '$between': [
                    moment.tz(args.date, "MM/DD/YYYY", store.timeZone).startOf('day').utc().toDate(),
                    moment.tz(args.date, "MM/DD/YYYY", store.timeZone).endOf('day').utc().toDate()
                ]
            }
        },
        include: [
            {
                model: Receipt,
                include: [
                    {
                        model: LineItem,
                        include: [
                            {
                                model: Transaction,
                                attributes: ['id', 'lineItemId', 'TotalPrice']
                            }
                        ]
                    }
                ]
            },
            {
                model: Device
            },
            {
                model: User
            }
        ],
        logging: console.log
    });


    // console.log(drawers.map(d => d.get({plain: true}).Receipts));
    // console.log(drawers.map(d => d.get({plain: true}).Device));
    // console.log(drawers.map(d => d.get({plain: true}).User));

    let drawerInfo = [];

    let drawerInfoTotal = {
        header: {
            store: store,
            drawer: {
                startingAmount: 0,
                endingAmount: 0,
            },
            device: {}
        },
        merchandise: {
            totalSale: 0,
            returns: 0,

        },
        tender: {
            cash: 0,
            giftCard: 0
        }
    };

    for (let drawer of drawers) {

        let info = {
            header: {
                store: store,
                drawer: drawer,
                device: drawer.Device,
                user: drawer.User
            },
            merchandise: {
                totalSale: 0,
                returns: 0,

            },
            tender: {
                cash: 0,
                giftCard: 0
            }
        };

        drawerInfoTotal.header.drawer.startingAmount += drawer.startingAmount;
        drawerInfoTotal.header.drawer.endingAmount += drawer.endingAmount;

       for(let receipt of drawer.Receipts) {

            let total = 0;
            for(let lineItem of receipt.LineItems) {
                for(let transaction of lineItem.Transactions) {
                    const transactionTotal = transaction.TotalPrice
                    total += transactionTotal
                    if(transaction.isReturn) {
                        info.merchandise.returns += transactionTotal;
                        drawerInfoTotal.merchandise.returns += transactionTotal;
                    }
                    else {
                        info.merchandise.totalSale += transactionTotal;
                        drawerInfoTotal.merchandise.totalSale += transactionTotal;
                    }

                    if(receipt.paymentMethod == 'cash') {

                        if(transaction.isReturn) {
                            info.tender.cash -= transactionTotal;
                            drawerInfoTotal.tender.cash -= transactionTotal;
                        }
                        else {
                            info.tender.cash += transactionTotal;
                            drawerInfoTotal.tender.cash += transactionTotal;
                        }
                    }
                    else {
                        if(transaction.isReturn) {
                            info.tender.giftCard -= transactionTotal;
                            drawerInfoTotal.tender.giftCard -= transactionTotal;
                        }
                        else {
                            info.tender.giftCard += transactionTotal;
                            drawerInfoTotal.tender.giftCard += transactionTotal;
                        }
                    }
                }
            }
        }

        drawerInfo.push(info);
    }

    drawerInfo.push(drawerInfoTotal);

    console.log(drawerInfo);

    return drawerInfo;
}
