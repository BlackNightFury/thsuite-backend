const { Receipt, LineItem, Transaction, TransactionTax, Tax, Product, ProductVariation, Package, Item, Store, sequelize } = alias.require('@models');
const moment = require('moment');
require('moment-timezone');

const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils')

const getReceiptSubTotal = receipt =>
    receipt.LineItems
        .filter(lineItem => !lineItem.isReturn)
        .reduce((subtotal,lineItem) =>
            subtotal + lineItem.Transactions.reduce((subtotal,transaction) => {
                const tax = transaction.TransactionTaxes.reduce((transactionTaxTotal,transactionTax) => transactionTaxTotal + transactionTax.amount, 0 )
                return subtotal + ( transaction.TotalPrice - tax + transaction.discountAmount )
             }, 0 ),
            0
        )

const getReceiptTax = receipt =>
    receipt.LineItems
        .filter(lineItem => !lineItem.isReturn)
        .reduce((tax,lineItem) =>
            tax + lineItem.Transactions.reduce((taxTotal, transaction) =>
                taxTotal + transaction.TransactionTaxes.reduce((transactionTaxTotal,transactionTax) => transactionTaxTotal + transactionTax.amount, 0 ),
                0
            ),
            0
        )

const getReceiptTotal = receipt =>
    receipt.LineItems
        .reduce((total,lineItem) => {
            let lineItemTotal = lineItem.Transactions.reduce((total, transaction) => total + transaction.TotalPrice,0)
            if(lineItem.isReturn) lineItemTotal = lineItemTotal * -1
            return total + lineItemTotal
        }, 0 )

const getReceiptRefund = receipt =>
    receipt.LineItems
        .filter(lineItem => lineItem.isReturn)
        .reduce((returnTotal,lineItem) => 
            returnTotal + lineItem.Transactions.reduce((total, transaction) => total + transaction.TotalPrice,0) - lineItem.discountAmount,
            0
        )

module.exports = async function(args){

    let store = await Store.find();

    let dateRange = args.dateRange;
    let filters = args.filters;

    let receiptWhere = {
        createdAt: {
            $between: [
                moment.utc(dateRange.startDate).toDate(),
                moment.utc(dateRange.endDate).toDate()
            ]
        }
    };

    if(filters.paymentMethod && filters.paymentMethod !== 'all'){
        receiptWhere.paymentMethod = filters.paymentMethod;
    }


    let receipts = await Receipt.findAll({
        where: receiptWhere,
        include: [
            {
                model: LineItem,
                include: [
                    {
                        model: Product,
                    },
                    {
                        model: ProductVariation,
                    },
                    {
                        model: Transaction,
                        include: [
                            {
                                model: Package,
                                include: [
                                    Item
                                ]
                            },
                            {
                                model: TransactionTax
                            }
                        ]
                    }
                ]
            }
        ]
    });

    const reportData = [ ]
    for(let row of receipts){
        let reportObj = {
            "Receipt Id": `${row.barcode}`,
            "Date/Time": moment.utc(row.createdAt).tz(store.timeZone).format("YYYY-MM-DD HH:mm:ss"),
            "Payment Method": row.paymentMethod,
            "Gift Card Id": row.giftcardTransactionId || 'N/A',
            "Sent to Metrc": row.LineItems.reduce( (result,lineItem) => !lineItem.sentToMetrc ? false : result, true ),
            "Subtotal": Utils.toDollarValue(getReceiptSubTotal(row)),
            "Discount": Utils.toDollarValue(row.LineItems.filter(lineItem => !lineItem.isReturn).reduce((discount,lineItem) => discount + lineItem.discountAmount,0)),
            "Return": Utils.toDollarValue(getReceiptRefund(row)),
            "Tax": Utils.toDollarValue(getReceiptTax(row)),
            "Total": Utils.toDollarValue(getReceiptTotal(row))
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const date = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/sales-breakdown-"+date+".csv");

}
