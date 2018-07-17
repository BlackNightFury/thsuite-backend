const { Receipt, LineItem, Transaction, TransactionTax, Tax, Discount, Product, ProductVariation, Package, Item, User, sequelize } = alias.require('@models');
const moment = require('moment');

module.exports = async function(args){

    let dateRange = args.dateRange;
    let filters = args.filters;

    let receiptWhere = {
        createdAt: {
            $between: [
                dateRange.startDate,
                dateRange.endDate
            ]
        }
    };

    if(filters.paymentMethod && filters.paymentMethod !== 'all'){
        receiptWhere.paymentMethod = filters.paymentMethod;
    }

    if(filters.userId){
        receiptWhere.userId = filters.userId;
    }

    if(filters.searchTerm){
        receiptWhere.barcode = { $like: `%${filters.searchTerm}%` }
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
                            },
                            {
                                model: Discount
                            }
                        ]
                    }
                ]
            },
            {
                model: User
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    let allReceiptsLength = receipts.length;
    let averageTimeOfSale = 0;
    let allReceiptsTotalSales = 0;

    calculateAverageTimeAndSales();

    function calculateAverageTimeAndSales(){
        if (!receipts || receipts.length == 0 ) return;
        var totalTime = 0;
        for (let eachReceipt of receipts){
            totalTime += eachReceipt.transactionTime;
            for (let eachLineItem of eachReceipt.LineItems){
                for (let eachTransaction of eachLineItem.Transactions){
                    allReceiptsTotalSales += eachTransaction.TotalPrice;
                }
            }
        }
        averageTimeOfSale = totalTime / receipts.length;
        console.log("Average POS Time: " + averageTimeOfSale)
    }

    function withinTimeFrame(receipt){
        if (filters.transactionType == 'all') return true;
        else if (filters.transactionType == 'above-avg') return receipt.transactionTime > averageTimeOfSale;
        else if (filters.transactionType == 'below-avg') return receipt.transactionTime < averageTimeOfSale;
    }

    let desiredReceipts = receipts.filter(withinTimeFrame);
    desiredReceipts = desiredReceipts.map((r) => (r.toJSON()));

    return {desiredReceipts, allReceiptsLength,
        allReceiptsTotalSales, averageTimeOfSale};
}
