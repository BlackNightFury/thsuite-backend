const { Item, Package, Store, Transaction, TransactionTax, Patient, Caregiver, Receipt, Product } = alias.require('@models');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils')
const moment = require('moment')
const Baby = require('babyparse');
const rebalanceTransactions = require('./rebalance-by-wholesale');
const config = require('../../config');

async function generateTransactionsFile(args){
    //If rebalance before export
    if(config.environment.rebalanceTransactionsBeforeExport){
        await rebalanceTransactions(args);
    }

    const transactions = await Transaction.findAll( {
        include: [
            {
                model: Package,
                include: [
                    Item
                ]
            },
            TransactionTax
        ],
        where: {
            isReturn: { $or: [ null, false ] },
            createdAt: {
                $between: [ args.startDate, args.endDate ]
            },
        },
    } );

    const reportData = [ ],
        formattedDate = moment(args.startDate).tz(args.timeZone).format("MM/DD/YYYY");

    for(let row of transactions){
        if(!row.Package.Item.MetrcId) {
            continue;
        }

        let taxes = 0;
        for(let tax of row.TransactionTaxes) {
            taxes += tax.amount;
        }

        let reportObj = {
            "Date": formattedDate,
            "Package Label": row.PackageLabel,
            "Quantity": row.QuantitySold,
            "Unit of Measure": row.Package.UnitOfMeasureName,
            "Total Price": Utils.toDollarValue( row.TotalPrice - taxes )
        };

        reportData.push([
            formattedDate,
            row.PackageLabel,
            row.QuantitySold,
            row.Package.UnitOfMeasureName.toUpperCase(),
            Utils.toDollarValue( row.TotalPrice - taxes)
        ]);
    }


    let csv = Baby.unparse(reportData, {
        header: false
    });

    let date = moment(args.startDate).tz(args.timeZone).format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, `reports/daily-transactions-${date}.csv`);
}

async function generateReceiptsFile(args){
    //If rebalance before export
    if(config.environment.rebalanceTransactionsBeforeExport){
        await rebalanceTransactions(args);
    }

    let pendingReceipts = await Receipt.findAll({
        include: [
            Patient,
            Caregiver,
            {
                model: Transaction,
                where: {
                    isReturn: { $or: [ null, false ] },
                    createdAt: {
                        $between: [ args.startDate, args.endDate ]
                    },
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

    //TODO: Replace with config environment variables
    let regex = new RegExp('.{1,4}', 'g');
    let reportData = [];
    for(let receipt of pendingReceipts){

        let transactions = receipt.Transactions;
        let salesDateTime = moment.utc(receipt.createdAt).tz(args.timeZone).format('YYYY-MM-DD HH:mm'); //TODO: Might need to change formatting
        let customerType;
        let patientNumber;
        let caregiverNumber;
        if(config.environment.transactionSubmissionType == 'medical'){
            customerType = receipt.caregiverId ? "Caregiver" : "Patient";
            patientNumber = receipt.Patient.medicalStateId.match(regex).join('-');
            caregiverNumber = receipt.caregiverId ? receipt.Caregiver.medicalStateId.match(regex).join('-') : null;
        }else if(config.environment.transactionSubmissionType == 'recreational'){
            customerType = "Consumer";
            patientNumber = "";
            caregiverNumber = "";
        }

        for(let transaction of transactions){
            // PackageLabel: transaction.PackageLabel,
            // Quantity: transaction.isReturn == 1 ? -1 * transaction.QuantitySold : transaction.QuantitySold,
            // UnitOfMeasure: transaction.Product.inventoryType == 'weight' ? 'Grams' : 'Each',
            // TotalAmount: (transaction.TotalPrice - transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0)).toFixed(2)

            reportData.push([
                salesDateTime,
                customerType,
                patientNumber,
                caregiverNumber,
                transaction.PackageLabel,
                transaction.isReturn == 1 ? -1 * transaction.QuantitySold : transaction.QuantitySold,
                transaction.Product.inventoryType == 'weight' ? 'Grams' : 'Each',
                (transaction.TotalPrice - transaction.TransactionTaxes.reduce((acc, tax) => acc + tax.amount, 0)).toFixed(2)
            ]);
        }

    }

    let csv = Baby.unparse(reportData, {
        header: false
    });

    let date = moment(args.startDate).tz(args.timeZone).format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, `reports/daily-transactions-${date}.csv`);
}

module.exports = async function(args){
    if(config.environment.transactionSubmissionMode == 'transactions'){
        console.log("Exporting in transaction mode...");
        return await generateTransactionsFile(args);
    }else if(config.environment.transactionSubmissionMode == 'receipts'){
        console.log("Exporting in receipt mode...");
        return await generateReceiptsFile(args);
    }else{
        throw new Error("Unknown transaction export mode. Please contact THSuite immediately.");
    }
};
