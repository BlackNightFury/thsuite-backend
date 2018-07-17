const { Transaction, Store, TransactionTax, Product, Package, Receipt, Patient, Caregiver } = alias.require('@models');
const moment = require('moment');
const Metrc = require("../../lib/metrc/index");
const AsyncLock = require('async-lock');
const config = require('../../config/index');
const rebalanceTransactions = require('./rebalance-by-wholesale');
require('moment-timezone');

const lock = new AsyncLock();

async function sendReceipts(){

    //If rebalance before export
    if(config.environment.rebalanceTransactionsBeforeExport){
        await rebalanceTransactions({});
    }

    const store = await Store.find();

    let pendingReceipts = await Receipt.findAll({
        include: [
            Patient,
            Caregiver,
            {
                model: Transaction,
                where: {
                    $or: [
                        {sentToMetrc: null},
                        {sentToMetrc: 0},
                    ]
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
            }
        ]
    });

    let receiptsToReport = [];

    //TODO: Replace with config environment variables
    let regex = new RegExp('.{1,4}', 'g');

    for(let receipt of pendingReceipts){

        let transactions = receipt.Transactions;

        console.log(`Adding Receipt ${receipt.barcode} to list of reported receipts`);
        let receiptToReport;
        if(config.environment.transactionSubmissionType == 'medical') {
            receiptToReport = {
                SalesDateTime: moment.utc(receipt.createdAt).tz(store.timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                SalesCustomerType: receipt.caregiverId ? "Caregiver" : "Patient",
                PatientLicenseNumber: receipt.Patient.medicalStateId.match(regex).join('-'),
                CaregiverLicenseNumber: receipt.caregiverId ? receipt.Caregiver.medicalStateId.match(regex).join('-') : null,
                Transactions: transactions.map(transaction => {
                    return {
                        PackageLabel: transaction.PackageLabel,
                        Quantity: transaction.isReturn == 1 ? -1 * transaction.QuantitySold : transaction.QuantitySold,
                        UnitOfMeasure: transaction.Product.inventoryType == 'weight' ? 'Grams' : 'Each',
                        TotalAmount: (transaction.TotalPrice - transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0)).toFixed(2)
                    };
                })
            };
        }else if(config.environment.transactionSubmissionType == 'recreational'){
            receiptToReport = {
                SalesDateTime: moment.utc(receipt.createdAt).tz(store.timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                SalesCustomerType: "Consumer",
                PatientLicenseNumber: null,
                CaregiverLicenseNumber: null,
                IdentificationMethod: null,
                Transactions: transactions.map(transaction => {
                    return {
                        PackageLabel: transaction.PackageLabel,
                        Quantity: transaction.isReturn == 1 ? -1 * transaction.QuantitySold : transaction.QuantitySold,
                        UnitOfMeasure: transaction.Product.inventoryType == 'weight' ? 'Grams' : 'Each',
                        TotalAmount: (transaction.TotalPrice - transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0)).toFixed(2)
                    };
                })
            }
        }

        receiptsToReport.push(receiptToReport);

    }

    try{
        await Metrc.Sale.createReceipt(store.licenseNumber, receiptsToReport);
        await Transaction.update({
            sentToMetrc: true
        }, {
            where: {}
        });
    }catch(e){
        throw new Error(`Error submitting: ${e.message}`);
    }


    return true;

}

async function sendTransactions(){
    const store = await Store.find();

    const pendingTransactions = await Transaction.findAll({
        where: {
            $or: [
                {sentToMetrc: null},
                {sentToMetrc: 0},
            ]
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

    const transactionsByDate = {};
    for (let transaction of pendingTransactions) {

        const date = moment.utc(transaction.transactionDate).tz(store.timeZone).format('YYYY-MM-DD');

        if (!transactionsByDate[date]) {
            transactionsByDate[date] = [];
        }

        transactionsByDate[date].push(transaction);
    }

    for (let date of Object.keys(transactionsByDate)) {

        const transactions = transactionsByDate[date];

        console.log(`Reporting to date ${date} ${transactions.length} transactions`);

        await Metrc.Transaction.create(store.licenseNumber, date, transactions.map(transaction => {
            return {
                PackageLabel: transaction.PackageLabel,
                Quantity: transaction.isReturn == 1 ? -1 * transaction.QuantitySold : transaction.QuantitySold,
                UnitOfMeasure: transaction.Product.inventoryType == 'weight' ? 'Grams' : 'Each',

                // totalWithTaxes: transaction.TotalPrice,
                // taxes: transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0),
                TotalAmount: (transaction.TotalPrice - transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0)).toFixed(2)
            };
        }));
    }

    await Transaction.update({
        sentToMetrc: true
    }, {
        where: {}
    });

    return true;
}

async function sendToMetrc() {

    if(config.environment.transactionSubmissionMode == 'transactions'){
        console.log("Reporting in transaction mode...");
        await sendTransactions();
        return true;
    }else if(config.environment.transactionSubmissionMode == 'receipts'){
        console.log("Reporting in receipt mode...");
        await sendReceipts();
        return true;
    }else{
        throw new Error("Unknown transaction submission mode. Please contact THSuite immediately.");
    }

};

module.exports = async () => {

    if (lock.isBusy()) {
        console.error('METRC Sync is already in progress');
        return false;
    } else {
        lock.acquire('sendToMetrc', async (done) => {
            console.log('METRC Sync started');
            await sendToMetrc();
            console.log('METRC Sync finished');
            done();
        }, (err, ret) => {
            console.error(err);
        }, { timeout: 3600000, maxPending: 1});

        return true;
    }
}