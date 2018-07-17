const {Transaction, LineItem, TransactionTax} = require('../../../models');
const moment = require('moment');
const uuid = require('uuid/v4');
const Promise = require('bluebird');

(async function(dryRun){

    console.log(`Now updating returns to have negative TotalPrice in ${dryRun ? "DRY RUN" : "LIVE"} mode`);

    if(!dryRun){
        console.log(`You have 5s to cancel`);
        await Promise.delay(5000);
    }

    console.log(`Now getting return transactions with positive TotalPrice...`);

    let positiveReturns = await Transaction.findAll({
        attributes: ['id', 'lineItemId', 'isReturn', 'TotalPrice'],
        where: {
            isReturn: true,
            TotalPrice: {
                $gt: 0
            }
        }
    });

    console.log(`Found ${positiveReturns.length} return transactions to process`);

    //Added to prevent a future developer from running this without checking to make sure it still works -- or even does what he/she thinks it does
    if(positiveReturns.length && !dryRun){
        console.log(`You should double check this is still runnable in its current state!`);
        console.log(`Remove this check once you're sure its supposed to work!`);
        process.exit(0);
    }

    if(!positiveReturns.length){
        console.log('No returns to process. Exiting...');
        process.exit(0);
    }

    for(let returnTransaction of positiveReturns){
        //Update line item price
        let returnLineItem = await LineItem.findOne({
            where:{
                id: returnTransaction.lineItemId
            }
        });

        console.log(`Transaction : ${returnTransaction.id} : has TotalPrice : ${returnTransaction.TotalPrice}`);
        console.log(`Line Item   : ${returnLineItem.id} : has price      : ${returnLineItem.price}`);

        console.log(`Now negating transaction TotalPrice from ${returnTransaction.TotalPrice} to ${returnTransaction.TotalPrice * -1}`);
        returnTransaction.TotalPrice *= -1;
        if(!dryRun) {
            await returnTransaction.save();
        }

        console.log(`Now negating line item price from ${returnLineItem.price} to ${returnLineItem.price * -1}`);
        returnLineItem.price *= -1;
        if(!dryRun){
            await returnLineItem.save();
        }

        console.log(`Now removing taxes from return transaction`);

        if(!dryRun){
            await TransactionTax.destroy({
                where: {
                    transactionId: returnTransaction.id
                },
                force: true
            });
        }

    }

})(!!(process.argv.find((arg) => arg == '--dry-run')));
