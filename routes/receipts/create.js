const { Drawer, Item, Transaction, Product, Package, ProductVariation, Receipt, Barcode, LineItem, Adjustment, sequelize } = alias.require('@models');
const moment = require('moment');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const genBarcode = require('../barcodes/generateBarcode');
const sendToMetrc = require('./send-receipt-to-metrc');
const config = require('../../config');
const io = require('../../lib/io');

sgMail.setApiKey(config.sendGrid);

module.exports = async function({receipt}) {

    console.log("Got receipt");

    console.log(JSON.stringify(receipt));

    let lineItems = receipt.LineItems;

    //Create barcode for this receipt
    if(config.environment.barcodeGenerationMode == 'random'){
        receipt.barcode = await genBarcode();
    }else if(config.environment.barcodeGenerationMode == 'sequential'){

        let barcodePrefix = "000";

        let receiptBarcode = await Receipt.findOne({
            attributes: [[sequelize.fn('MAX', sequelize.col('barcode')), 'max_barcode']],
            where: {
                barcode: {
                    $like: barcodePrefix + "%"
                }
            }
        });

        let maxBarcode = receiptBarcode.get('max_barcode');

        let barcodeNum;

        if(maxBarcode == null){
            barcodeNum = 1;
        }else{
            barcodeNum = parseInt(maxBarcode) + 1;
        }

        let barcodeString = barcodePrefix + (''+barcodeNum).lpad("0", 9 - barcodePrefix.length);

        receipt.barcode = barcodeString;

    }else{
        //Fallback to random
        receipt.barcode = await genBarcode();
    }
    receipt.createdAt = moment().format();

    //Check if drawer is open, if not -- fail
    let drawer = await Drawer.findOne({
        where: {
            id: receipt.drawerId
        }
    });

    if(drawer.endingAmount !== null){
        //Fail -- drawer is closed
        throw new Error("Oops! It looks like you may be trying to process this transaction on an old / closed drawer and therefore the transaction was not completed successfully. This may be caused by using multiple tabs on the same device. Please close any duplicate THSuite windows open on this device and contact THSuite.");
    }

    //Explanation of validation loop:
    //The validation loop follows the same logic as the creation loop, but doesn't save/update anything
    //The validation loop does all the validation checks and throws errors before any data is persisted to the db

    //Validation loop
    for(let lineItemData of lineItems){
        let transactions = lineItemData.Transactions;

        for(let transactionData of transactions){

            if( transactionData.isReturn ) {
                if( !transactionData.originalTransactionId ) {
                    throw new Error("Return requires original transactionData");
                }

                let originalTransaction = await Transaction.findOne( { where: { id: transactionData.originalTransactionId }, include: [ { model: LineItem, include: [ Receipt ] } ] } )

                if(!originalTransaction) {
                    throw new Error("Return requires original transactionData");
                }

                if(originalTransaction.wasReturned && originalTransaction.returnedQuantity + transactionData.QuantitySold > originalTransaction.QuantitySold ) {
                    throw new Error("Already returned");
                }

            }

            let taxes = transactionData.TransactionTaxes;

            let existingTransaction = await Transaction.findOne({
                where: {
                    id: transactionData.id
                }
            });

            if(existingTransaction) {
                throw new Error("Transaction already exists");
            }

            let metrcPackage = await Package.findOne({
                where: {
                    id: transactionData.packageId
                }
            });

            if(!metrcPackage) {
                throw new Error("Package doesn't exist");
            }


            //can we just get this once for the line item?
            let product = await Product.findOne({
                where: {
                    id: transactionData.productId
                }
            });

            if(!product) {
                throw new Error("Product doesn't exist");
            }



            let productVariation = await ProductVariation.findOne({
                where : {
                    id: transactionData.productVariationId
                }
            });

            if(!productVariation){
                throw new Error("Product variation doesn't exist");
            }


            if(!transactionData.isReturn && metrcPackage.Quantity < transactionData.QuantitySold) {
                if(config.environment.sendOverdrawnEmail){
                    let mailResult = await sgMail.send( {
                        to: config.environment.overdrawnEmails.length ? config.environment.overdrawnEmails : ['joe@thsuite.com', 'simon@thsuite.com'],
                        from: 'noreply@thsuite.com',
                        subject: `Overdrawn Package Warning -- ${metrcPackage.Label}`,
                        html: `
                        <div>This is an automated warning message. The package with label ${metrcPackage.Label} was overdrawn by a recent transaction.</div>
                        <br>
                        <div>Details:</div>
                        <br>
                        <div>Package Label: ${metrcPackage.Label}</div>
                        <br>
                        <div>Receipt ID: ${receipt.barcode}</div>
                        <br>
                        <div>Quantity Purchased: ${transactionData.QuantitySold}</div>
                        <br>
                        <div>Quantity in Package prior to purchase: ${metrcPackage.Quantity}</div>
                        <br>
                        <div>${metrcPackage.Label} is now overdrawn by ${metrcPackage.Quantity - transactionData.QuantitySold}</div>
                        `
                    } );
                }else{
                    throw new Error(`Oops! It looks like the package ${metrcPackage.Label} in this transaction doesn't have enough quantity to complete the transaction.`);
                }
            }

        }
    }

    //At this point, this means data validates and can be saved, don't need to check again in creation loop


    let receiptToSave = Receipt.build(receipt);

    const receiptsToUpdate = {};
    const transactionsToUpdate = {};
    const packagesToUpdate = {};

    await receiptToSave.save();

    for(let lineItemData of lineItems){
        let transactions = lineItemData.Transactions;

        let lineItem = await receiptToSave.createLineItem(lineItemData);

        let lineItemProduct = await Product.findOne({
            include: [ { model: Item, include: [ Package ] }, { model: ProductVariation, include: [ Barcode ] } ],
            where: {
                id: lineItemData.productId
            }
        });

        for(let transactionData of transactions){

            if( transactionData.isReturn ) {

                let originalTransaction = await Transaction.findOne( { where: { id: transactionData.originalTransactionId }, include: [ { model: LineItem, include: [ Receipt ] } ] } );

                let result = await originalTransaction.update( { returnedQuantity: originalTransaction.returnedQuantity + transactionData.QuantitySold, wasReturned: true } )

                if(!receiptsToUpdate[ originalTransaction.LineItem.Receipt.id ]){
                    receiptsToUpdate[ originalTransaction.LineItem.Receipt.id ] = originalTransaction.LineItem.Receipt.get({plain: true})
                }

                if(!transactionsToUpdate[originalTransaction.id]){
                    transactionsToUpdate[originalTransaction.id] = result;
                }
            }

            let taxes = transactionData.TransactionTaxes;

            let metrcPackage = await Package.findOne({
                where: {
                    id: transactionData.packageId
                }
            });

            //can we just get this once for the line item?
            let product = await Product.findOne({
                where: {
                    id: transactionData.productId
                }
            });


            let productVariation = await ProductVariation.findOne({
                where : {
                    id: transactionData.productVariationId
                }
            });


            let isCountBased = metrcPackage.UnitOfMeasureName === 'Each';

            let UnitOfMeasureName = isCountBased ? 'Each' : 'Grams';
            let UnitOfMeasureAbbreviation = isCountBased ? "ea" : "g";


            //All good, decrease package quantity and barcode quantity if applicable
            if(lineItem.barcodeId){

                //I know that this could be done in a more "programmer" way, but we're dealing with important code here
                //things like altering quantity should be as explicit as possible, thus the ugly multiline solution
                if( !transactionData.isReturn ) {
                    //Decrease package.Quantity by quantity, barcode.remainingInventory by 1
                    metrcPackage.Quantity -= transactionData.QuantitySold;
                }else{
                    metrcPackage.Quantity += transactionData.QuantitySold;
                }

                let barcode = await Barcode.findOne({
                    where: {
                        id: lineItem.barcodeId
                    }
                });

                if( !transactionData.isReturn ) {
                    barcode.remainingInventory -= lineItem.quantity;
                }
                await barcode.save();
                await metrcPackage.save();
                packagesToUpdate[metrcPackage.id] = metrcPackage;
            }else{
                //Decrease package.Quantity, package.availableQuantity by quantity
                //I know that this could be done in a more "programmer" way, but we're dealing with important code here
                //things like altering quantity should be as explicit as possible, thus the ugly multiline solution
                if( !transactionData.isReturn ) {
                    metrcPackage.Quantity -= transactionData.QuantitySold;
                    metrcPackage.availableQuantity -= transactionData.QuantitySold;
                }else{
                    metrcPackage.Quantity += transactionData.QuantitySold;
                    metrcPackage.availableQuantity += transactionData.QuantitySold;
                }
                await metrcPackage.save();
                packagesToUpdate[metrcPackage.id] = metrcPackage;
            }

            let transaction = await lineItem.createTransaction({
                id: transactionData.id,

                receiptId: receipt.id,

                packageId: metrcPackage.id,
                productId: product.id,
                productVariationId: productVariation.id,
                supplierId: metrcPackage.supplierId,
                itemId: transactionData.itemId || metrcPackage.itemId,
                discountId: transactionData.discountId,
                discountAmount: transactionData.discountAmount,
                isReturn: transactionData.isReturn,
                transactionDate: moment(),

                PackageLabel: metrcPackage.Label,
                QuantitySold: transactionData.QuantitySold,
                TotalPrice: transactionData.TotalPrice,

                MetrcPackageId: metrcPackage.MetrcId,
                ProductName: product.name,
                SalesDeliveryState: null
            });

            for(let taxData of taxes){
                await transaction.createTransactionTax(taxData);
            }
        }
    }

    let throwMetrcError = false;

    if(config.environment.realTimeTransactionReporting){
        try{
            await sendToMetrc(receiptToSave.id);
        }catch(err){
            console.log('err submitting to metrc');
            console.log(err);
            throwMetrcError = true;
        }
    }


    console.log("Emitting receipt");
    this.broadcast.emit('create', receiptToSave.get({plain: true}));

    Object.keys( receiptsToUpdate ).forEach( id => {
        console.log(receiptsToUpdate[id]);
        this.broadcast.emit('update', receiptsToUpdate[id]);
        this.emit('update', receiptsToUpdate[id] )
    });

    Object.keys(transactionsToUpdate).forEach(id => {
        console.log(`Emitting update for ${id}`)
        io.of('/transactions').emit('update', transactionsToUpdate[id]);
    });

    Object.keys(packagesToUpdate).forEach(id => {
        io.of('/packages').emit('update', packagesToUpdate[id]);
    });


    return {success: true, receiptBarcode: receiptToSave.barcode, createdAt: receipt.createdAt, metrcError: throwMetrcError};

};
