
const models = require('../models');


(async function() {

    let [results] = await models.sequelize.query(`
        select transactions.createdAt - interval 6 hour as timestamp, transactions.id, receiptId, transactions.PackageLabel, QuantitySold, TotalPrice,  ROUND((wholesalePrice / ReceivedQuantity) * QuantitySold, 2) as transactionWholesale, wholesalePrice as packageWholesale, ROUND(wholesalePrice / ReceivedQuantity, 2) as unitWholesale, 
            (select count(1) from line_items where line_items.receiptId = transactions.receiptId) as numLineItems, 
            ROUND((wholesalePrice / ReceivedQuantity) * QuantitySold, 2) - TotalPrice as diff
        from transactions
        inner join packages on packages.id = transactions.packageId
        where  transactions.createdAt > '2017-12-02 16:00:00' AND packages.wholesalePrice AND
            TotalPrice < (wholesalePrice / ReceivedQuantity) * QuantitySold
            AND transactions.deletedAt is null
        having numLineItems > 1
        order by transactions.createdAt desc
    `);

    console.log(results);


    for(let receipt of results) {

        let transactionToIncrease = await models.Transaction.findOne({
            where: {
                id: receipt.id
            }
        })

        let otherTransactions = await models.Transaction.findAll({
            where: {
                id: {$ne: receipt.id},
                receiptId: receipt.receiptId
            }
        })

        if(!otherTransactions.length) {
            console.log(`Row ${receipt.receiptId} has no other transactions`)
            continue;
        }




        let diffNeeded = receipt.diff;
        let diffPerTransaction = diffNeeded / otherTransactions.length;

        if(diffNeeded < 0.01) {
            console.log(`Adding 0.01 to ${transactionToIncrease.id}`);
            transactionToIncrease.TotalPrice += 0.01;
            await transactionToIncrease.save();
            continue;
        }

        for(let transaction of otherTransactions) {
            console.log(`Removing ${diffPerTransaction} from ${transaction.id}`);
            transaction.TotalPrice -= diffPerTransaction;
            await transaction.save()
        }

        console.log(`Adding ${diffNeeded} to ${transactionToIncrease.id}`);
        transactionToIncrease.TotalPrice += diffNeeded;
        await transactionToIncrease.save();

    }
})();