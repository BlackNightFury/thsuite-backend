const { Transaction, ProductVariation, Receipt, LineItem} = require('../models');
const moment = require('moment');
const uuid = require('uuid/v4');
const Promise = require('bluebird');

(async function(dryRun){

    console.log(`Transferring return info from line items to transactions in ${dryRun ? "DRY RUN" : "LIVE"} mode`);

    if(!dryRun){
        console.log(`You have 5s to cancel`);
        await Promise.delay(5000);
    }

    //Get all line items with return data on them

    let lineItems = await LineItem.findAll({
        attributes: ['id', 'productVariationId', 'isReturn', 'wasReturned', 'returnedQuantity'],
        where:  {
            $or: [
                {
                    isReturn: true
                },
                {
                    wasReturned: true
                },
                {
                    returnedQuantity: {
                        $ne: 0
                    }
                }
            ]
        }
    });

    console.log(`Got ${lineItems.length} line items to transfer.`);

    for(let lineItem of lineItems){

        console.log(`   Now processing line item ${lineItem.id}`);
        console.log(`       isReturn: ${lineItem.isReturn}`);
        console.log(`       wasReturned: ${lineItem.wasReturned}`);
        console.log(`       returnedQuantity: ${lineItem.returnedQuantity}`);

        let returnedQuantity = 0;

        if(lineItem.returnedQuantity > 0){
            console.log(`       Line item has returned quantity, need to calculate actual amount returned...`);

            let productVariation = await ProductVariation.findOne({
                where: {
                    id: lineItem.productVariationId
                },
                paranoid: false
            });

            if(!productVariation){
                throw new Error('Unable to find product variation for line item');
            }

            returnedQuantity = lineItem.returnedQuantity * productVariation.quantity;

            console.log(`           Actual returned quantity is ${returnedQuantity}`);

        }

        let transaction = await Transaction.findOne({
            where: {
                lineItemId: lineItem.id
            },
            paranoid: false
        });

        if(!transaction){
            throw new Error('Unable to find transaction for line item');
        }

        console.log(`       Updating transaction ${transaction.id} for line item ${lineItem.id}`);

        console.log(`           isReturn: ${transaction.isReturn} => ${lineItem.isReturn}`);
        console.log(`           isReturn: ${transaction.wasReturned} => ${lineItem.wasReturned}`);
        console.log(`           isReturn: ${transaction.returnedQuantity} => ${returnedQuantity}`);

        if(!dryRun){
            transaction.isReturn = lineItem.isReturn;
            transaction.wasReturned = lineItem.wasReturned;
            transaction.returnedQuantity = returnedQuantity;
            await transaction.save();
        }


    }

})(!!(process.argv.find((arg) => arg == '--dry-run')));
