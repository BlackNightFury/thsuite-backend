const { Alert, Transaction, Product, Package, ProductType, Receipt, Barcode, Item, TransactionTax, Tax } = require('../../models');
const moment = require('moment');
const uuid = require('uuid/v4');

(async function (){

    console.log("DO NOT USE. TRANSACTIONS CAN HAVE NEGATIVE TOTAL PRICES (RETURNS). MESSAGE ADDED 2/13/2018");
    return;

    console.log("Fixing receipts with negative TotalPrice");

    let transactions = await Transaction.findAll({
     attributes: ['receiptId'],
     where: {
         TotalPrice: {
             $lt: 0
         }
     }
    });

    let receiptIds = transactions.map((t) => t.receiptId);

    let receipts = await Receipt.findAll({
     where: {
         id: {
             $in: receiptIds
         }
     }
    });

    console.log(`Got ${receipts.length} receipts with transactions with negative TotalPrice`);

    let count = 0;

    for(let receipt of receipts){
     console.log(`  Now processing receipt ${receipt.barcode}`);

     let transactions = await Transaction.findAll({
         where: {
             receiptId: receipt.id
         }
     });

     console.log(`  Receipt contains ${transactions.length} transactions`);

     let pos = 0;
     let neg = 0;

     let positiveTransactions = [];
     let negativeTransactions = [];

     for(let transaction of transactions){

         if(transaction.TotalPrice > 0){
             positiveTransactions.push(transaction);
             pos++;
         }else if(transaction.TotalPrice < 0){
             negativeTransactions.push(transaction);
             neg++;
         }

     }

     console.log(`  Out of ${transactions.length} transactions, ${pos} have positive TotalPrices and ${neg} have negative TotalPrices`);


     for(let negativeTransaction of negativeTransactions){
         console.log(`      Trying to balance ${negativeTransaction.id} to $0.00. Current TotalPrice is ${negativeTransaction.TotalPrice}`);
         for(let positiveTransaction of positiveTransactions){
             //Try to balance to 0.00

             console.log(`          Positive Transaction ${positiveTransaction.id} has TotalPrice of ${positiveTransaction.TotalPrice} to start`);

             let amountToGo = Math.abs(negativeTransaction.TotalPrice);
             if(negativeTransaction.TotalPrice >= 0){
                 console.log(`          Negative Transaction is already at or above 0. No balancing.`);
                 continue;
             }

             // See if we can take total amountToGo from this transaction
             if(positiveTransaction.TotalPrice - amountToGo >= 0){
                 console.log(`          Positive Transaction ${positiveTransaction.id} has enough to balance this transaction`);
                 positiveTransaction.TotalPrice -= amountToGo;
                 negativeTransaction.TotalPrice += amountToGo;
             }else{
                 console.log(`          Positive Transaction ${positiveTransaction.id} does not have enough to cover entire balance, taking as much as possible`);
                 let diff = positiveTransaction.TotalPrice;
                 negativeTransaction.TotalPrice += positiveTransaction.TotalPrice;
                 positiveTransaction.TotalPrice = 0;
                 console.log(`              Moved $${diff} from positive transaction to negative transaction`);
             }

             console.log(`              After rebalance, negative transaction has a TotalPrice of ${negativeTransaction.TotalPrice}`);
             console.log(`              After rebalance, positive transaction has a TotalPrice of ${positiveTransaction.TotalPrice}`);

         }

     }

     //After all balanced to 0, check if any positive transactions have positive TotalPrices, if so, try to get to 0.01
     let allTransactions = positiveTransactions.concat(negativeTransactions);

     let zero = 0;
     pos = 0;

     let zeroTransactions = [];
     positiveTransactions = [];

     for(let transaction of allTransactions){
         if(transaction.TotalPrice === 0){
             zeroTransactions.push(transaction);
             zero++;
         }else if(transaction.TotalPrice > 0){
             positiveTransactions.push(transaction);
             pos++;
         }else{
             throw new Error("Transaction with negative TotalPrice encountered after balancing");
         }
     }

     for(let zeroTransaction of zeroTransactions){
         console.log(`      Trying to balance ${zeroTransaction.id} to $0.01. Current TotalPrice is ${zeroTransaction.TotalPrice}`);
         for(let positiveTransaction of positiveTransactions){
             //Try to balance to 0.00

             console.log(`          Positive Transaction ${positiveTransaction.id} has TotalPrice of ${positiveTransaction.TotalPrice} to start`);

             if(zeroTransaction.TotalPrice >= 0.01){
                 console.log(`          Zero Transaction is already above 0. No balancing.`);
                 continue;
             }

             // See if we can take total amountToGo from this transaction
             if(positiveTransaction.TotalPrice >= 0.02){
                 console.log(`          Positive Transaction ${positiveTransaction.id} has enough to balance this transaction`);
                 positiveTransaction.TotalPrice -= 0.01;
                 zeroTransaction.TotalPrice += 0.01;
             }else{
                 console.log(`          Cannot rebalance from this positive transaction, doesn't have a penny to move`);
             }

             console.log(`              After rebalance, negative transaction has a TotalPrice of ${zeroTransaction.TotalPrice}`);
             console.log(`              After rebalance, positive transaction has a TotalPrice of ${positiveTransaction.TotalPrice}`);

         }

     }

     console.log(`  Final TotalPrices:`);
     for(let transaction of allTransactions){
         console.log(`  Transaction: ${transaction.id} -- Price: ${transaction.TotalPrice}`);
     }

     console.log(`  Now saving rebalanced transactions`);

     for(let transaction of allTransactions){
         await transaction.save();
     }

     // break;
    }

})();