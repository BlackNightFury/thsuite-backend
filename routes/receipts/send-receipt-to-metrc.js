const {Store, Receipt, Transaction, TransactionTax, Product, Package, Patient, Caregiver} = alias.require('@models');
const moment = require('moment');
const Metrc = require("../../lib/metrc/index");
const config = require('../../config/index');
require('moment-timezone');
//NOTE: This is for sending a single receipt in real time to Metrc. If you are looking for issues with batch sending receipts to Metrc, check /transactions/send-to-metrc.js
module.exports = async (receiptId) => {

    const store = await Store.find();

    let licenseNumber = store.licenseNumber;
    // let licenseNumber = 'D-17-X0001';

    let receipt = await Receipt.findOne({
        where: {
            id: receiptId
        },
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

    //If guest patient transaction, allow without submitting
    if(!receipt.Patient.medicalStateId){
        return true;
    }

    let transactions = receipt.Transactions;

    console.log(`Reporting Receipt ${receipt.barcode} to Metrc at ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}`);

    //TODO: Replace with config environment variables
    let regex = new RegExp('.{1,4}', 'g');

    let receiptToReport = {
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

    console.log(receiptToReport);

    await Metrc.Sale.createReceipt(licenseNumber, receiptToReport);

    await Transaction.update({
        sentToMetrc: true
    }, {
        where: {
            receiptId: receiptId
        }
    });

    return true;

};
