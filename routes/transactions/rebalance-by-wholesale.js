const models = require('../../models');
const Common = require('./common');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');

const recalculateTaxForTransaction = async (transactionId) => {

    console.log(`   Now recalculating tax for transaction ${transactionId}`);
    let transaction = await models.Transaction.findOne({
        where: {
            id: transactionId
        },
        include: [
            {
                model: models.Item,
                include: {
                    model: models.ProductType
                }
            },
            {
                model: models.TransactionTax
            }
        ]
    });

    let taxes = await models.Tax.findAll();

    //Subtract out old taxes from TotalPrice
    let oldTaxAmount = transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0);

    console.log(`       Subtracting ${oldTaxAmount} from TotalPrice ${transaction.TotalPrice}`);

    transaction.TotalPrice -= oldTaxAmount;

    console.log(`       Deleting transaction taxes for transaction ${transaction.id}`);

    // Delete transaction taxes
    await models.TransactionTax.destroy({
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
    //Recalculate tax
    for(let tax of taxes){
        if(category == 'cannabis' && tax.appliesToCannabis || category == 'non-cannabis' && tax.appliesToNonCannabis){
            let percent = tax.percent / 100;
            let taxAmount = transaction.TotalPrice * percent;

            console.log(`               Applying tax "${tax.name}" at ${tax.percent}% for a dollar amount of $${taxAmount}`);
            //Create transaction tax records
            await models.TransactionTax.create({
                id: uuid.v4(),
                transactionId: transaction.id,
                taxId: tax.id,
                amount: taxAmount
            });

            toAdd += taxAmount;
        }
    }

    console.log(`       After adding taxes, TotalPrice must be increased by $${toAdd} to $${transaction.TotalPrice + toAdd}`);
    //Add tax amount to total price
    transaction.TotalPrice = transaction.TotalPrice + toAdd;

    await transaction.save();

};

module.exports = async function(args){

    //Magical query
    let query = `
        SELECT Transaction.createdAt as timestamp, Transaction.id as transactionId, Transaction.receiptId, Transaction.PackageLabel, Transaction.QuantitySold, Transaction.TotalPrice,
            ROUND((Package.wholesalePrice / Package.ReceivedQuantity) * Transaction.QuantitySold, 2) as transactionWholesale, Package.wholesalePrice as packageWholesale,
            ROUND(Package.wholesalePrice / Package.ReceivedQuantity, 2) as unitWholesale,
            (SELECT COUNT(1) from line_items as LineItem where LineItem.receiptId = Transaction.receiptId) as numLineItems,
            (SELECT SUM(TransactionTax.amount) FROM transaction_taxes as TransactionTax WHERE TransactionTax.transactionId = Transaction.id) as tax,
            ROUND((Package.wholesalePrice / Package.ReceivedQuantity) * Transaction.QuantitySold, 2) - (Transaction.TotalPrice - (SELECT SUM(TransactionTax.amount) FROM transaction_taxes as TransactionTax WHERE TransactionTax.transactionId = Transaction.id)) as diff
        FROM transactions as Transaction
        INNER JOIN packages as Package ON Package.id = Transaction.packageId
        WHERE 
            ${args.startDate && args.endDate ? 'Transaction.createdAt BETWEEN :startDate AND :endDate AND' : ''}
            Package.wholesalePrice IS NOT NULL 
            AND (Transaction.TotalPrice - (SELECT SUM(TransactionTax.amount) FROM transaction_taxes as TransactionTax WHERE TransactionTax.transactionId = Transaction.id)) < (Package.wholesalePrice / Package.ReceivedQuantity) * Transaction.QuantitySold 
            AND (Transaction.isReturn IS NULL OR Transaction.isReturn = 0)
            AND Package.MetrcId != 0
            AND Transaction.deletedAt IS NULL
        HAVING numLineItems > 1
        ORDER BY Transaction.createdAt DESC;
    `;

    //Brief explanation of this query (if you're here it means that transactions are getting reported under wholesale)
    //This query gets all transactions that have been completed in a certain time that have a TotalPrice that is lower than the per unit wholesale price multiplied by quantity purchased
    //This only gets transactions on cannabis packages, non cannabis items are ignored
    //This query only pulls receipts with multiple line items. This is for two reasons
    //1. You can't rebalance a transaction if there are no other transactions to pull from
    //2. Wholesale price detection at the register should be preventing receipts with only one line item from being completed if that line item is discounted below wholesale
    //The query calculates the wholesale price of the transaction, along with total wholesale and per unit wholesale.

    const startDate = args.startDate;
    const endDate = args.endDate;

    let results = await models.sequelize.query(query, Common.QueryOptions(startDate, endDate));

    if(!results){
        return;
    }

    let underByReceipt = {};

    for(let transactionData of results){

        let receiptId = transactionData.receiptId;

        if(!underByReceipt[receiptId]){
            underByReceipt[receiptId] = [];
        }

        underByReceipt[receiptId].push(transactionData.transactionId);

    }

    for(let transactionData of results) {

        console.log(transactionData);

        let transactionToIncrease = await models.Transaction.findOne({
            where: {
                id: transactionData.transactionId
            }
        });

        let receiptId = transactionData.receiptId;

        //These should only be transactions that are over wholesale
        let otherTransactions = await models.Transaction.findAll({
            where: {
                id: {
                    $notIn: underByReceipt[receiptId]
                },
                receiptId: transactionData.receiptId
            },
            include: [
                {
                    model: models.TransactionTax
                }
            ]
        });

        if(!otherTransactions.length) {
            console.log(`Row ${transactionData.receiptId} has no other transactions`);
            continue;
        }


        let diffNeeded = transactionData.diff;

        if(diffNeeded < 0.01) {
            console.log(`Adding 0.01 to ${transactionToIncrease.id}`);
            transactionToIncrease.TotalPrice += 0.01;
            await transactionToIncrease.save();
            //Recalculate tax
            await recalculateTaxForTransaction(transactionToIncrease.id);
            continue;
        }

        let totalRoomToGive = 0;
        for(let transaction of otherTransactions){
            console.log(`Now calculating roomToGive for transaction ${transaction.id}`);
            let _package = await models.Package.findOne({
                attributes: ['id', 'wholesalePrice', 'ReceivedQuantity', [models.sequelize.literal('ROUND(wholesalePrice / ReceivedQuantity, 2)'), 'unitWholesale']],
                where: {
                    Label: transaction.PackageLabel
                }
            });
            console.log(`Package ${transaction.PackageLabel} has wholesalePrice of $${_package.wholesalePrice} and ReceivedQuantity of ${_package.ReceivedQuantity} for a unitWholesale of $${_package.get('unitWholesale')}`);

            let tax = transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0).toFixed(2);

            console.log(`Transaction has ${tax} in tax`);

            transaction.roomToGive = transaction.TotalPrice - tax - _package.get('unitWholesale');

            console.log(`Transaction has roomToGive: ${transaction.roomToGive}`);

            totalRoomToGive += transaction.roomToGive;

        }

        console.log(`Total roomToGive is ${totalRoomToGive}`);

        if(totalRoomToGive < diffNeeded){
            //Fire off email
            // let mailResult = await sgMail.send( {
            //     to: ['joe@thsuite.com', 'simon@thsuite.com'],
            //     from: 'noreply@thsuite.com',
            //     subject: `Rebalancer was unable to rebalance a transaction -- ${transactionData.transactionId}`,
            //     html: `
            //     <div>The rebalancer was unable to rebalance the transaction ${transactionData.transactionId}</div>
            //     <br>
            //     <div>This transaction was part of receipt ${receiptId}</div>
            //     `
            // } );
            continue;
        }

        //Sort transactions
        let orderedTransactions = otherTransactions.sort((a,b) => {
            return b.TotalPrice - a.TotalPrice;
        });

        let diffRemaining = diffNeeded;

        for(let transaction of orderedTransactions){

            console.log(`Now checking transaction ${transaction.id}`);

            if(transaction.roomToGive <= 0.01){
                console.log(`Transaction ${transaction.id} has a penny or less to give. Skipping...`);
                continue;
            }

            if(diffRemaining <= 0){
                console.log(`diffRemaining was 0 or less at the start of the loop. Exiting loop...`);
                break;
            }

            let toTake;
            if(transaction.roomToGive >= diffRemaining){
                console.log(`Transaction has more roomToGive than diffRemaining`);
                toTake = diffRemaining;
            }else{
                toTake = transaction.roomToGive;
            }

            console.log(`Removing ${toTake} from ${transaction.id}`);
            transaction.TotalPrice -= toTake;
            await transaction.save();
            //Recalculate tax
            await recalculateTaxForTransaction(transaction.id);
            diffRemaining -= toTake;
            console.log(`After removing ${toTake}, diffRemaining is ${diffRemaining}`);
        }


        console.log(`Adding ${diffNeeded} to ${transactionToIncrease.id}`);
        transactionToIncrease.TotalPrice += diffNeeded;
        await transactionToIncrease.save();
        //Recalculate tax
        await recalculateTaxForTransaction(transactionToIncrease.id);

    }

    //Catch all for $0
    try {
        console.log("Now double checking for transactions at $0");
        let zeroQuery = `
        SELECT Transaction.createdAt as timestamp, Transaction.id as transactionId
        WHERE
        ${args.startDate && args.endDate ? 'Transaction.createdAt BETWEEN :startDate AND :endDate AND' : ''}
        Transaction.TotalPrice = 0`;

        let zeroResults = await models.sequelize.query(zeroQuery, Common.QueryOptions(startDate, endDate));

        if (!zeroResults) {
            return;
        }

        for (let transactionData of zeroResults) {
            let transactionToIncrease = await models.Transaction.findOne({
                where: {
                    id: transactionData.transactionId
                }
            });

            console.log(`Found transaction for package ${transactionToIncrease.PackageLabel} at $0`);
            console.log(`Adding 0.01 to ${transactionToIncrease.id}`);
            transactionToIncrease.TotalPrice += 0.01;
            await transactionToIncrease.save();
            //Recalculate tax
            await recalculateTaxForTransaction(transactionToIncrease.id);
        }
    }catch(e){
        console.log(`ERROR -- Unable to reabalance 0s -- ERROR`);
        console.log(e);
    }


}
