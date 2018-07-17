require('../../init');

const { Transaction, Store, TransactionTax, Product, Package, Receipt, Patient, Caregiver } = alias.require('@models');
const moment = require('moment');
const sgMail = require('@sendgrid/mail')
const Metrc = require("../../lib/metrc/index");
const AsyncLock = require('async-lock');
const config = require('../../config/index');
const rebalanceTransactions = require('../../routes/transactions/rebalance-by-wholesale');
require('moment-timezone');

const lock = new AsyncLock();
sgMail.setApiKey(config.sendGrid);

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
                }),
                _meta: { store, receipt, transactionIds: transactions.map(transaction => transaction.id) }
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
                }),
                _meta: { store, receipt, transactionIds: transactions.map(transaction => transaction.id) }
            }
        }

        receiptsToReport.push(receiptToReport);
    }

    const updatedTransactionIds = [];
    let metrcFailures = 0;

    for (const receiptToReport of receiptsToReport) {
        if (metrcFailures > 2) {
            console.error('Too many metrc failures');
            break;
        }

        try {
            const transactionIdsToBeUpdated = receiptToReport._meta.transactionIds.slice();
            delete receiptToReport._meta;

            await Metrc.Sale.createReceipt(store.licenseNumber, [receiptToReport]);

            for (transactionId of transactionIdsToBeUpdated) {
                updatedTransactionIds.push(transactionId);
            }
        } catch(e) {
            console.error(`Error submitting receipt: ${e.message}`);
            await sendFailureReceiptEmail(receiptToReport._meta);
            metrcFailures += 1;
        }
    }

    if (updatedTransactionIds && updatedTransactionIds.length) {
        await Transaction.update({
            sentToMetrc: true
        }, {
            where: {
                id: {
                    '$in': updatedTransactionIds
                }
            }
        });
    }

    return true;
}

async function sendFailureReceiptEmail(data) {
    await sgMail.send({
        to: ['simon@thsuite.com', 'anne@thsuite.com', 'joe@thsuite.com'],
        from: 'noreply@thsuite.com',
        subject: `Failed to resend metrc receipt`,
        html: `<section>
            <div>Store: ${data.store.name} (${data.store.licenseNumber})</div>
            <hr/>
            <div>Receipt: ${data.receipt.id} (${data.receipt.createdAt})</div>
        </section>`
    })
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
            Receipt,
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

    const updatedTransactionIds = [];
    let metrcFailures = 0;

    for (let date of Object.keys(transactionsByDate)) {

        if (metrcFailures > 2) {
            console.error('Too many metrc failures');
            break;
        }

        const transactions = transactionsByDate[date];

        console.log(`Reporting to date ${date} ${transactions.length} transactions`);

        try {
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

            for (transaction of transactions) {
                updatedTransactionIds.push(transaction.id);
            }
        } catch(e) {
            console.error(`Error submitting transaction: ${e.message}`);
            await sendFailureTransactionEmail({ store, receipt: transactions[0].Receipt });
            metrcFailures += 1;
        }
    }

    if (updatedTransactionIds && updatedTransactionIds.length) {
        await Transaction.update({
            sentToMetrc: true
        }, {
            where: {
                id: {
                    '$in': updatedTransactionIds
                }
            }
        });
    }

    return true;
}

async function sendFailureTransactionEmail(data) {
    await sgMail.send({
        to: ['simon@thsuite.com', 'anne@thsuite.com', 'joe@thsuite.com'],
        from: 'noreply@thsuite.com',
        subject: `Failed to resend metrc transaction`,
        html: `<section>
            <div>Store: ${data.store.name} (${data.store.licenseNumber})</div>
            <hr/>
            <div>Receipt: ${data.receipt.id} (${data.receipt.createdAt})</div>
        </section>`
    })
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

    if (config.environment.resendMetrcReceipts) {

        if (lock.isBusy()) {
            console.error('METRC Sync is already in progress');
            return false;
        } else {
            lock.acquire('resendToMetrc', async (done) => {
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
}

if (require.main == module) {
    module.exports();
}
