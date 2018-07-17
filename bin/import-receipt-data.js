const { Alert, Transaction, Product, Package, ProductVariation, Receipt, Barcode, LineItem } = require('../models');
const moment = require('moment');
const uuid = require('uuid/v4');
const fs = require('fs');

(async function(){

    fs.readFile('failed-receipts.json', async (err, data) => {
        let json = JSON.parse(data.toString());


        for(let receipt of json) {

            console.log(receipt.id);

            let lineItems = receipt.LineItems;

            let receiptToSave = await Receipt.findOne({
                where: {
                    id: receipt.id
                }
            });

            for (let lineItemData of lineItems) {
                let transactions = lineItemData.Transactions;


                let lineItem = await receiptToSave.createLineItem(lineItemData);

                for (let transactionData of transactions) {

                    let taxes = transactionData.TransactionTaxes;

                    let existingTransaction = await Transaction.findOne({
                        where: {
                            id: transactionData.id
                        }
                    });

                    if (existingTransaction) {
                        throw new Error("Transaction already exists");
                    }


                    let datum = {
                        transactionData
                    };


                    let metrcPackage = await Package.findOne({
                        where: {
                            id: transactionData.packageId
                        }
                    });
                    if (!metrcPackage) {
                        throw new Error("Package doesn't exist");
                    }


                    //can we just get this once for the line item?
                    let product = await Product.findOne({
                        where: {
                            id: transactionData.productId
                        }
                    });
                    if (!product) {
                        throw new Error("Product doesn't exist");
                    }


                    let productVariation = await ProductVariation.findOne({
                        where: {
                            id: transactionData.productVariationId
                        }
                    });
                    if (!productVariation) {
                        throw new Error("Product variation doesn't exist");
                    }


                    if (transactionData.isReturn === false && metrcPackage.Quantity < transactionData.QuantitySold) {
                        throw new Error("Not enough quantity in package");
                    }


                    let isCountBased = metrcPackage.UnitOfMeasureName === 'Each';

                    //TODO check if units are allowed to be different
                    let UnitOfMeasureName = isCountBased ? 'Each' : 'Grams';
                    let UnitOfMeasureAbbreviation = isCountBased ? "ea" : "g";


                    //All good, decrease package quantity and barcode quantity if applicable
                    if (lineItem.barcodeId) {

                        if (!lineItem.isReturn) {
                            //Decrease package.Quantity by quantity, barcode.remainingInventory by 1
                            metrcPackage.Quantity -= transactionData.QuantitySold;
                        }
                        let barcode = await Barcode.findOne({
                            where: {
                                id: lineItem.barcodeId
                            }
                        });

                        if (!lineItem.isReturn) {
                            barcode.remainingInventory -= lineItem.quantity;
                        }
                        await barcode.save();
                        await metrcPackage.save();
                    } else {
                        //Decrease package.Quantity, package.availableQuantity by quantity
                        if (!lineItem.isReturn) {
                            metrcPackage.Quantity -= transactionData.QuantitySold;
                            metrcPackage.availableQuantity -= transactionData.QuantitySold;
                        }
                        await metrcPackage.save();
                    }

                    // transactionsToMetrc.push({
                    //     PackageLabel: metrcPackage.Label,
                    //     Quantity: transaction.quantity,
                    //     UnitOfMeasure: UnitOfMeasureName,
                    //     TotalAmount: transaction.total
                    // });

                    let transaction = await lineItem.createTransaction({
                        id: transactionData.id,

                        receiptId: receipt.id,

                        packageId: metrcPackage.id,
                        productId: product.id,
                        productVariationId: productVariation.id,
                        supplierId: metrcPackage.supplierId,
                        itemId: transactionData.itemId,
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

                    for (let taxData of taxes) {
                        await transaction.createTransactionTax(taxData);
                    }
                }

            }
        }
    })

})();