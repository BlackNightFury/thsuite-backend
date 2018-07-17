const express = require('express');
const router = express.Router();

const moment = require('moment');
require('moment-timezone');


const {Store, Drawer, Receipt, LineItem, Device, User} = require('../../../models');

/* GET home page. */
router.get('/:date', async function (req, res, next) {

    let store = await Store.find();
    let drawers = await Drawer.findAll({
        where: {
            createdAt: {
                '$between': [
                    moment.tz(req.params.date, store.timeZone).startOf('day').utc().toDate(),
                    moment.tz(req.params.date, store.timeZone).endOf('day').utc().toDate()
                ]
            }
        },
        include: [
            {
                model: Receipt,
                include: [
                    { model: LineItem, include: [ Transaction ] }
                ]
            },
            {
                model: Device
            },
            {
                model: User
            }
        ]
    });


    // console.log(drawers.map(d => d.get({plain: true}).Receipts));
    // console.log(drawers.map(d => d.get({plain: true}).Device));
    // console.log(drawers.map(d => d.get({plain: true}).User));

    let drawerInfo = [];

    let drawerInfoByDevice = {};
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

        if(!drawerInfoByDevice[drawer.Device.id]) {
            drawerInfoByDevice[drawer.Device.id] = {
                header: {
                    store: store,
                    drawer: {
                        startingAmount: 0,
                        endingAmount: 0,
                    },
                    device: drawer.Device,
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
        }


        drawerInfoTotal.header.drawer.startingAmount += drawer.startingAmount;
        drawerInfoTotal.header.drawer.endingAmount += drawer.endingAmount;

        drawerInfoByDevice[drawer.Device.id].header.drawer.startingAmount += drawer.startingAmount;
        drawerInfoByDevice[drawer.Device.id].header.drawer.endingAmount += drawer.endingAmount;


        for(let receipt of drawer.Receipts) {

            let total = 0;
            for(let lineItem of receipt.LineItems) {
                for(let transaction of lineItem.Transactions) {
                    const transactionTotal = transaction.TotalPrice
                    total += transactionTotal
                    if(transaction.isReturn) {
                        info.merchandise.returns += transactionTotal;
                        drawerInfoTotal.merchandise.returns += transactionTotal;
                        drawerInfoByDevice[drawer.Device.id].merchandise.returns += transactionTotal
                    }
                    else {
                        info.merchandise.totalSale += transactionTotal;
                        drawerInfoTotal.merchandise.totalSale += transactionTotal;
                        drawerInfoByDevice[drawer.Device.id].merchandise.totalSale += transactionTotal;
                    }

                    if(receipt.paymentMethod == 'cash') {

                        if(transaction.isReturn) {
                            info.tender.cash -= transactionTotal;
                            drawerInfoTotal.tender.cash -= transactionTotal;
                            drawerInfoByDevice[drawer.Device.id].tender.cash -= transactionTotal;
                        }
                        else {
                            info.tender.cash += transactionTotal;
                            drawerInfoTotal.tender.cash += transactionTotal;
                            drawerInfoByDevice[drawer.Device.id].tender.cash += transactionTotal;
                        }
                    }
                    else {
                        if(transaction.isReturn) {
                            info.tender.giftCard -= transactionTotal;
                            drawerInfoTotal.tender.giftCard -= transactionTotal;
                            drawerInfoByDevice[drawer.Device.id].tender.giftCard -= transactionTotal;
                        }
                        else {
                            info.tender.giftCard += transactionTotal;
                            drawerInfoTotal.tender.giftCard += transactionTotal;
                            drawerInfoByDevice[drawer.Device.id].tender.giftCard += transactionTotal;
                        }
                    }
                }
            }
        }

        drawerInfo.push(info);
    }

    Object.keys(drawerInfoByDevice).forEach(info => drawerInfo.push(drawerInfoByDevice[info]));
    drawerInfo.push(drawerInfoTotal);

    console.log(drawerInfo);


    res.render('drawer-breakdown', {
        date: req.params.date,
        drawerInfo,
    });
});

module.exports = router;
