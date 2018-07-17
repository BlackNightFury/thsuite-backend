const {Store, Receipt, Transaction, TransactionTax, Product, Package, Patient, Caregiver} = alias.require('@models');
const moment = require('moment');
const Metrc = require("../../lib/metrc/index");
const config = require('../../config/index');
require('moment-timezone');

module.exports = async function(receiptId){
    const store = await Store.find();

    let receipt = await Receipt.findOne({
        where: {
            id: receiptId
        },
        paranoid: false
    });

    let licenseNumber = store.licenseNumber;
    // let licenseNumber = 'D-17-X0001';

    let metrcReceipts = await Metrc.Sale.listReceipts(licenseNumber);

    console.log(`Got ${metrcReceipts.length} receipts from Metrc`);

    let receiptToVoid = metrcReceipts.find(metrcReceipt => {
        console.log(`Void Receipt: ${moment.utc(receipt.createdAt).tz(store.timeZone).format()}`);
        console.log(`Metrc Receipt (${metrcReceipt.Id}): ${moment.tz(metrcReceipt.SalesDateTime, store.timeZone).format()}`);
        console.log(`Diff: ${moment.utc(receipt.createdAt).tz(store.timeZone).diff(moment.tz(metrcReceipt.SalesDateTime, store.timeZone), 'milliseconds')}`);
        return moment.utc(receipt.createdAt).tz(store.timeZone).diff(moment.tz(metrcReceipt.SalesDateTime, store.timeZone), 'milliseconds') == 0;
    });

    if(!receiptToVoid){
        throw new Error('Unable to void receipt, unable to find in Metrc');
    }

    let metrcId = receiptToVoid.Id;

    console.log(`Found receipt to void with ID: ${metrcId}`);

    try{
        await Metrc.Sale.deleteReceipt(licenseNumber, metrcId);
        return true;
    }catch(e){
        console.log(e.message);
        throw new Error(e.message);
    }

}