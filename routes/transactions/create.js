
const { Transaction, Product, Package, ProductVariation, Receipt, Barcode } = alias.require('@models');
const moment = require('moment');

const genBarcode = require('../barcodes/generateBarcode');

module.exports = async function({transactions, discountAmount}) {

    /*
    Required fields for transaction

    id
    packageId
    quantity
    total

     */

    //TODO handle receipts for Oregon
    //TODO run whole method in db transaction

    //TODO validate all transactions before creating the receipt

    let transactionData = [];

    for(let transaction of transactions) {

        let existingTransaction = await Transaction.findOne({
            where: {
                id: transaction.id
            }
        });

        if(existingTransaction) {
            throw new Error("Transaction already exists");
        }


        let datum = {
            transaction
        };



        datum.metrcPackage = await Package.findOne({
            where: {
                id: transaction.packageId
            }
        });
        if(!datum.metrcPackage) {
            throw new Error("Package doesn't exist");
        }



        datum.product = await Product.findOne({
            where: {
                id: transaction.productId
            }
        });
        if(!datum.product) {
            throw new Error("Product doesn't exist");
        }



        datum.productVariation = await ProductVariation.findOne({
            where : {
                id: transaction.productVariationId
            }
        });
        if(!datum.productVariation){
            throw new Error("Product variation doesn't exist");
        }


        if(datum.metrcPackage.Quantity < transaction.quantity) {
            throw new Error("Not enough quantity in package");
        }

        // TODO update after tax changes
        // let totalFromDb = datum.productVariation.price * transaction.quantity;
        // if(totalFromDb !== transaction.total) {
        //     throw new Error("Price mismatch");
        // }

        transactionData.push(datum);
    }

    let transactionsToMetrc = [];
    let transactionsToDb = [];

    //Make a new receipt for this transaction set
    let receipt = await Receipt.build({
        userId: transactions[0].userId //TODO
    });

    //Create barcode for this receipt
    receipt.barcode = await genBarcode();
    receipt.giftcardTransactionId =

    await receipt.save();

    for(let datum of transactionData) {

        let {
            transaction,
            metrcPackage,
            product,
            productVariation

        } = datum;

        let isCountBased = metrcPackage.UnitOfMeasureName === 'Each';

        //TODO check if units are allowed to be different
        let UnitOfMeasureName = isCountBased ? 'Each' : 'Grams';
        let UnitOfMeasureAbbreviation = isCountBased ? "ea" : "g";


        //All good, decrease package quantity and barcode quantity if applicable
        if(transaction.fromBarcode){
            //Decrease package.Quantity by quantity, barcode.remainingInventory by 1
            metrcPackage.Quantity -= transaction.quantity;
            let barcode = await Barcode.findOne({
                where: {
                    barcode: transaction.barcode
                }
            });

            barcode.remainingInventory -= 1;
            barcode.save();
            metrcPackage.save();
        }else{
            //Decrease package.Quantity, package.availableQuantity by quantity
            metrcPackage.Quantity -= transaction.quantity;
            metrcPackage.availableQuantity -= transaction.quantity;
            metrcPackage.save();
        }

        transactionsToMetrc.push({
            PackageLabel: metrcPackage.Label,
            Quantity: transaction.quantity,
            UnitOfMeasure: UnitOfMeasureName,
            TotalAmount: transaction.total
        });

        transactionsToDb.push({
            id: transaction.id,

            receiptId: receipt.id,

            packageId: metrcPackage.id,
            productId: product.id,
            productVariationId: productVariation.id,
            supplierId: metrcPackage.supplierId,

            discountId: transaction.discountId,
            discountAmount: transaction.discountAmount,
            transactionDate: moment(),

            PackageLabel: metrcPackage.Label,
            QuantitySold: transaction.QuantitySold,
            TotalPrice: transaction.TotalPrice,

            MetrcPackageId: metrcPackage.MetrcId,
            ProductName: product.name,
            SalesDeliveryState: null
        });
    }

    //TODO send to metrc
    await Transaction.bulkCreate(transactionsToDb);

    return {success: true, receiptBarcode: receipt.barcode};
};