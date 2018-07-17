
const {Store, Drawer, Receipt, LineItem, Device, User} = alias.require('@models');
const moment = require('moment');

module.exports = async function(args){

    let store = await Store.find();
    let drawers = await Drawer.findAll({
        where: {
            createdAt: {
                '$between': [
                    moment.tz(args.date, store.timeZone).startOf('day').utc().toDate(),
                    moment.tz(args.date, store.timeZone).endOf('day').utc().toDate()
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
                for(let transaction of receipt.LineItems) {
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

    let makePDF = async function(barcode, pageNumber){
        let s3Link;
        const AWS = require('aws-sdk');
        const config = alias.require('@root/config/index');
        let s3Stream = require('s3-upload-stream')(new AWS.S3({
            accessKeyId: config.etc.s3.key,
            secretAccessKey: config.etc.s3.secret,
            region: 'us-east-1'
        }));

        try {
            let html = await Promise.fromCallback(callback => {
                let ejs = require('ejs');
                return ejs.renderFile(__dirname + '/../../view/reports/drawer-breakdown.ejs', {
                    date: moment(args.date).format('MM/DD/YYYY'),
                    drawerInfo,
                }, callback);
            });

            return await Promise.fromCallback(callback => {
                console.log("Report HTML Saved Successfully!");
                let wkhtmltopdf = require('wkhtmltopdf');
                let read = wkhtmltopdf(html, {
                    //output: "./bin/barcodes/barcode.pdf",
                    pageSize: 'letter',
                    orientation: 'portrait',
                });

                let upload = s3Stream.upload({
                    "Bucket": config.etc.s3.bucket,
                    "Key": "reports/drawer-report-"+args.date+".pdf",
                });
                upload.on('error', function (error) {
                    console.log(error);
                    callback(error);
                });
                upload.on('uploaded', function (details) {
                    //TODO details.location
                    console.log(details);
                    s3Link = details.Location;
                    callback(null, s3Link);
                });
                read.pipe(upload);
            });
        }
        catch(e) {
            console.log(e);
        }
    }

    return await makePDF();

}
