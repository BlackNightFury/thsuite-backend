const { Alert, Transaction, Product, Package, ProductVariation, Receipt, Barcode, LineItem, TransactionTax } = require('../models');
const moment = require('moment');
const uuid = require('uuid/v4');
const fs = require('fs');

//Check if all the values for keys in a, match the values in b
const matchObjects = function(a, b){

    let matched = true;

    Object.keys(a).forEach((key) => {

        if(a[key] !== b[key]){
            matched = false;
        }

    });

    return matched;

};

(async function(){

    fs.readFile('11-12-17-metrc-transactions.json', async (err, data) => {

        //Get transactions marked as sent to metrc
        let sentTransactions = await Transaction.findAll({
            where: {
                sentToMetrc: 1,
                createdAt: {
                    $between: [
                        "2017-11-12 07:00:00",
                        "2017-11-13 06:59:00"
                    ]
                }
            },
            include: [
                TransactionTax,
                Product,
                {
                    model: Package,
                    where: {
                        MetrcId: {$ne: 0}
                    }
                }
            ]
        });

        let transactionMap = {};

        let totalTransactionAmount = 0;

        for(let sentTransaction of sentTransactions){

            totalTransactionAmount += (sentTransaction.TotalPrice - sentTransaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0));

            if(!transactionMap[sentTransaction.PackageLabel]){
                transactionMap[sentTransaction.PackageLabel] = {
                    PackageLabel: sentTransaction.PackageLabel,
                    QuantitySold: sentTransaction.QuantitySold,
                    UnitOfMeasureName: sentTransaction.Product.inventoryType === 'weight' ? 'Grams' : 'Each',
                    TotalPrice: (sentTransaction.TotalPrice - sentTransaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0))
                };
            }else{
                transactionMap[sentTransaction.PackageLabel].QuantitySold += sentTransaction.QuantitySold;
                transactionMap[sentTransaction.PackageLabel].TotalPrice += (sentTransaction.TotalPrice - sentTransaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0));
            }

        }


        console.log("Total Amount in $: " + totalTransactionAmount.toFixed(2));

        let json = JSON.parse(data.toString());
        let found = 0;
        let total = json.length;
        for(let transaction of json){
            // console.log(transaction);

            //Get transactions under this label
            let dbTransaction = transactionMap[transaction.PackageLabel];


            if(matchObjects(dbTransaction, transaction)){
                found++;
            }else{
                dbTransaction.TotalPrice = parseFloat(dbTransaction.TotalPrice.toFixed(2));
                if(matchObjects(dbTransaction, transaction)){
                    found++;
                }
            }

        }

        console.log("Found: " + found);
        console.log("Total in file: " + total);
    })

})();
