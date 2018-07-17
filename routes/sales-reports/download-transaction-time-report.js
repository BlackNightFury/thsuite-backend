const { Receipt, LineItem, Transaction, TransactionTax, Tax, Product, ProductVariation, Package, Item, Store, User, sequelize } = alias.require('@models');
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
    console.log(filters);

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
                model: User
            },
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
        ],
        order: [['createdAt', 'DESC']]
    });

    let averageTimeOfSale = calculateAverageTime();

    function calculateAverageTime(){
        if (!receipts || receipts.length == 0 ) return;
        var totalTime = 0;
        for (let eachReceipt of receipts){
            totalTime += eachReceipt.transactionTime;
        }
        console.log("Average POS Time (for CSV): " + totalTime / receipts.length);
        return totalTime / receipts.length;
    }

    function withinTimeFrame(receipt){
        if (filters.transactionType == 'all') return true;
        else if (filters.transactionType == 'above-avg') return receipt.transactionTime > averageTimeOfSale;
        else if (filters.transactionType == 'below-avg') return receipt.transactionTime < averageTimeOfSale;
    }

    let desiredReceipts = receipts.filter(withinTimeFrame);

    const reportData = [ ]
    for(let row of desiredReceipts){
        let reportObj = {
            "Receipt Id": `${row.barcode}`,
            "Date/Time": moment.utc(row.createdAt).tz(store.timeZone).format("YYYY-MM-DD HH:mm:ss"),
            "Employee": row.User ? row.User.firstName + ' ' + row.User.lastName : ' ',
            "Payment Method": row.paymentMethod,
            "Gift Card Id": row.giftcardTransactionId || 'N/A',
            "Total Price": Utils.toDollarValue(getReceiptTotal(row)),
            "Transaction Time (secs)": row.transactionTime
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const date = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/sales-by-transaction-time-"+date+".csv");

}
