require('../../init');
const {Item, Product, Package, Transaction, ProductVariation, Receipt, Tax, Store} = alias.require('@models');
const Metrc = alias.require('@lib/metrc');

const uuid = require('uuid');
const moment = require('moment');

module.exports = async function(store) {

    let taxes = await Tax.findAll();

    let packages = await Package.findAll({
        include: [Item]
    });
    let packagesMap = {};
    for(let _package of packages) {
        packagesMap[_package.MetrcId] = _package;
    }


    let productVariations = await ProductVariation.findAll({
        include: [Item]
    });
    let productVariationsMap = {};
    for(let productVariation of productVariations) {
        if(productVariation.Items[0]) {
            productVariationsMap[productVariation.Items[0].MetrcId] = productVariation;
        }
    }

    let transactionDates = await Metrc.Transaction.listDateSummary(store.licenseNumber);
    transactionDates = transactionDates.map(td => td.SalesDate);
    transactionDates.sort().reverse();

    // let date = moment().format('YYYY-MM-DD');
    let date = '2017-11-10';

    let newTransactionCount = 0;
    console.log(`Getting transactions for ${date}`);

    //Transaction Time is 12:00pm Mountain Time
    //Equates to 6:00pm or 18:00 UTC

    let mountainTime = "18:00:00";


    let transactionDate =  date + ' ' + mountainTime;

    let receipt = await Receipt.create({
        id: uuid.v4(),
        storeId: store.id,
        barcode: 'IMPORT-' + date,
        userId: null,

        createdAt: transactionDate,
        updatedAt: transactionDate
    });

    // let transactions = await Metrc.Transaction.listDate(store.licenseNumber, date);
    let transactions = JSON.parse(require('fs').readFileSync('./reconciled-transactions.json'));

    for(let transaction of transactions) {

        let metrcPackage = packagesMap[transaction.PackageId];
        if(!metrcPackage) {
            //TODO we should still be importing these transactions
            console.warn("Could not find package with id " + transaction.PackageId);
            continue;
        }

        if(metrcPackage.Label !== transaction.PackageLabel) {
            console.warn("Package label does not match");
            continue;
        }

        let productVariation = productVariationsMap[metrcPackage.Item.MetrcId];

        if(!productVariation) {
            console.warn("Could not find product variation");
            continue;
        }

        let lineItem = await receipt.createLineItem({
            id: uuid.v4(),
            productId: productVariation.productId,
            productVariationId: productVariation.id,
            discountId: null,
            discountAmount: 0,
            barcodeId: null, //TODO should maybe populate barcode
            quantity: transaction.QuantitySold,
            price: transaction.TotalPrice,
            createdAt: transactionDate,
            updatedAt: transactionDate
        });

        let dbTransaction = await lineItem.createTransaction({
            id: uuid.v4(),
            storeId: store.id,
            receiptId: receipt.id,
            packageId: metrcPackage.id,
            productId: productVariation.productId,
            productVariationId: productVariation.id,
            itemId: metrcPackage.itemId,
            discountId: null,
            discountAmount: 0,

            transactionDate: transactionDate,

            PackageLabel: transaction.PackageLabel,
            ProductName: transaction.ProductName,
            QuantitySold: transaction.QuantitySold,
            TotalPrice: transaction.TotalPrice,
            SalesDeliveryState: transaction.SalesDeliveryState,
            ArchivedDate: transaction.ArchivedDate,
            LastModified: transaction.LastModified,

            sentToMetrc: true,
            createdAt: transactionDate,
            updatedAt: transactionDate
        });

        for(let tax of taxes) {
            await dbTransaction.createTransactionTax({
                id: uuid.v4(),
                taxId: tax.id,
                amount: transaction.TotalPrice * tax.percent / 100
            })
        }

        newTransactionCount++;
    }

    console.log(`Imported ${newTransactionCount} Transactions`);
};

if(require.main == module) {
    Store.findOne()
        .then(module.exports);
}