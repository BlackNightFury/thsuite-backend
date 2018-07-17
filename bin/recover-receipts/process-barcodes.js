require("../../init");

const {Barcode, Transaction, BarcodeProductVariationItemPackage, Package} = require('../../models');

(async function() {

    let barcodesLog = require('fs').readFileSync('./barcodes.log', {encoding: 'utf8'}).split('\n');


    let barcodeMap = {};
    for(let barcode of barcodesLog) {
        if(!barcodeMap[barcode]) {
            barcodeMap[barcode] = 0
        }

        barcodeMap[barcode]++;
    }

    // console.log(barcodeMap);


    let totalTransactions = await Transaction.findAll({
        where: {
            createdAt: {
                $gte: '2017-12-05 16:25:39',
                $lte: '2017-12-05 20:43:07'
            }
        },
        paranoid: false
    });

    console.log(`There were ${barcodesLog.length} scans in the time range`);
    console.log(`There were ${totalTransactions.length} transactions in the time range`);
    console.log(`There were ${Object.keys(barcodeMap).length} unique barcodes in the time range`);

    for(let barcode in barcodeMap) {
        let count = barcodeMap[barcode];

        let barcodeObj = await Barcode.find({
            where: {
                barcode: barcode
            },
            include: [
                {
                    model: BarcodeProductVariationItemPackage,
                    include: [Package]
                }
            ]
        });

        if(!barcodeObj) {
            // console.log(`Could not find barcode ${barcode}`);
            continue;
        }

        let transactions = await Transaction.findAll({
            where: {
                packageId: barcodeObj.BarcodeProductVariationItemPackages[0].packageId,
                createdAt: {
                    $gte: '2017-12-05 16:25:39',
                    $lte: '2017-12-05 19:15:06'
                }
            },
            paranoid: false
        });

        if(transactions.length > count) {
            // console.log(`Too many transactions for barcode ${barcode} (${transactions.length} > ${count})`)
        }
        else if(transactions.length < count) {
            // console.log(`Not enough transactions for barcode ${barcode} (${transactions.length} < ${count})`);
            console.log(`${barcodeObj.BarcodeProductVariationItemPackages[0].Package.Label}`)
        }
        else {
            // console.log(`Just enough transactions for barcode ${barcode} (${count})`)
        }
    }



    console.log('Done');
})()
