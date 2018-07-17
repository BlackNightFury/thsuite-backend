const { Alert, Transaction, Product, Package, ProductType, Receipt, Barcode, Item, TransactionTax, Tax } = require('../../../models');
const moment = require('moment');
const uuid = require('uuid/v4');

(async function(){

    console.log("Retroactively fixing Karing Kind Taxes...");

    let receipts = await Receipt.findAll({
        where: {
            barcode: {
                $like: '%IMPORT%'
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

            let toAdd = 0;

            for(let tax of taxes){
                if(category == 'cannabis' && tax.appliesToCannabis || category == 'non-cannabis' && tax.appliesToNonCannabis){
                    let percent = tax.percent / 100;
                    let taxAmount = transaction.TotalPrice * percent;

                    console.log(`               Applying tax "${tax.name}" at ${tax.percent}% for a dollar amount of $${taxAmount}`);

                    await TransactionTax.create({
                        id: uuid.v4(),
                        transactionId: transaction.id,
                        taxId: tax.id,
                        amount: taxAmount
                    });

                    toAdd += taxAmount;
                }
            }

            console.log(`       After adding taxes, TotalPrice must be increased by $${toAdd} to $${transaction.TotalPrice + toAdd}`);

            transaction.TotalPrice = transaction.TotalPrice + toAdd;

            await transaction.save();

        }
    }

})();
