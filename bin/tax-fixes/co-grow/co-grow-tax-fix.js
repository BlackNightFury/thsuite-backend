const { Alert, Transaction, Product, Package, ProductType, Receipt, Barcode, Item, TransactionTax, Tax } = require('../../../models');
const moment = require('moment');
const uuid = require('uuid/v4');

(async function(){

    console.log("Retroactively fixing CO Grow Taxes...");

    let receipts = await Receipt.findAll({
        where: {
            barcode: {
                $notLike: '%IMPORT%'
            }
        }
    });

    let taxes = await Tax.findAll();

    console.log(`Found ${receipts.length} receipts to fix`);

    for(let receipt of receipts){
        console.log(`   Now fixing ${receipt.barcode}...`);

        //Get all transactions for this receipt
        let transactions = await Transaction.findAll({
            where: {
                receiptId: receipt.id
            },
            include: [
                {
                    model: Item,
                    include: {
                        model: ProductType
                    }
                }
            ]
        });

        console.log(`   Got ${transactions.length} transactions associated with this receipt`);

        for(let transaction of transactions){

            if(transaction.TotalPrice < 0){
                console.log(`       Transaction has negative total price. Skipping...`);
                continue;
            }

            console.log(`       Deleting transaction taxes for transaction ${transaction.id}`);

            await TransactionTax.destroy({
                where: {
                    transactionId: transaction.id
                },
                force: true
            });

            console.log(`       Transaction has TotalPrice = $${transaction.TotalPrice}`);

            //Given total price, calculate taxes for this transaction

            let category = transaction.Item.ProductType.category;

            console.log(`       Transaction was for an item with category "${category}"`);

            let effectiveRate = 0;

            for(let tax of taxes){
                if(category == "cannabis" && tax.appliesToCannabis || category == "non-cannabis" && tax.appliesToNonCannabis){
                    effectiveRate += tax.percent;
                }
            }

            let totalTax = (transaction.TotalPrice * effectiveRate) / (100 + effectiveRate);

            for(let tax of taxes){
                if(category == "cannabis" && tax.appliesToCannabis || category == "non-cannabis" && tax.appliesToNonCannabis) {
                    //Apply this tax
                    let proportionOfEffective = tax.percent / effectiveRate;
                    let taxAmount = totalTax * proportionOfEffective;

                    console.log(`       Applying tax "${tax.name}" at ${tax.percent}% for a dollar amount of $${taxAmount}`);

                    await TransactionTax.create({
                        id: uuid.v4(),
                        transactionId: transaction.id,
                        taxId: tax.id,
                        amount: taxAmount
                    });
                }
            }

        }
    }

})();