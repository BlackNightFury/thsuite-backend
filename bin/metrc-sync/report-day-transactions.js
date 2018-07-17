const {Store, Transaction, TransactionTax, Product, Package} = require('../../models');

const Metrc = require("../../lib/metrc/index");

(async function() {

    let date = '2017-11-10';

    let store = await Store.find()

    let pendingTransactions = await Transaction.findAll({
        where: {
            sentToMetrc: null
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

    let response = await Metrc.Transaction.create(store.licenseNumber, date, pendingTransactions.map(transaction => {
        return {
            PackageLabel: transaction.PackageLabel,
            Quantity: transaction.QuantitySold,
            UnitOfMeasure: transaction.Product.inventoryType == 'weight' ? 'Grams' : 'Each',


            // totalWithTaxes: transaction.TotalPrice,
            // taxes: transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0),
            TotalAmount: (transaction.TotalPrice - transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0)).toFixed(2)
        };
    }));

    console.log(response);

    // console.log(pendingTransactions.map(transaction => {
    //     return {
    //         PackageLabel: transaction.PackageLabel,
    //         Quantity: transaction.QuantitySold,
    //         UnitOfMeasure: transaction.Product.inventoryType == 'weight' ? 'Grams' : 'Each',
    //
    //
    //         totalWithTaxes: transaction.TotalPrice,
    //         taxes: transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0),
    //         TotalAmount: (transaction.TotalPrice - transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0)).toFixed(2)
    //     };
    // }))


})();