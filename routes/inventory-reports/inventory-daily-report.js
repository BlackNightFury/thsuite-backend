const {Package, Item, ProductVariationItem, ProductVariation, Product, ProductType, Supplier, sequelize } = alias.require('@models');
const moment = require('moment');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils')
const Baby = require('babyparse');

const packageQuery = conditions =>
    `SELECT Item.name, Package.Label, Package.ReceivedQuantity,
        IFNULL(Adjustment.amount, 0) as adjustmentAmount, IFNULL(Transaction.QuantitySold, 0) as transactionAmount,
        IFNULL(AdjustmentAll.amount, 0) as adjustmentAmountAll, IFNULL(TransactionAll.QuantitySold, 0) as transactionAmountAll,
        IFNULL(Transaction.returnedQuantity, 0) as returnedAmount, IFNULL(TransactionAll.returnedQuantity, 0) as returnedAmountAll,
        ProductType.category, Package.UnitOfMeasureAbbreviation, ProductType.name as type, Package.wholesalePrice,
        (SELECT price / quantity FROM product_variations WHERE product_variations.productId = Product.id ORDER BY price / quantity DESC LIMIT 1) as valuePerUnit

    FROM packages as Package
    INNER JOIN items as Item ON Item.id = Package.itemId
    INNER JOIN products as Product ON Product.itemId = Item.id
    INNER JOIN product_types AS ProductType ON ProductType.id = Item.productTypeId
    LEFT JOIN (
        SELECT Adjustment.packageId, SUM(Adjustment.amount) as amount
        FROM adjustments AS Adjustment
        WHERE date BETWEEN :startDate AND :endDate AND deletedAt IS NULL
        GROUP BY Adjustment.packageId
    ) as Adjustment ON Adjustment.packageId = Package.id
    LEFT JOIN (
        SELECT Adjustment.packageId, SUM(Adjustment.amount) as amount
        FROM adjustments AS Adjustment
        WHERE date < :startDate AND deletedAt IS NULL
        GROUP BY Adjustment.packageId
    ) as AdjustmentAll ON AdjustmentAll.packageId = Package.id
    LEFT JOIN (
        SELECT Transaction.receiptId, Transaction.packageId, SUM(case when isReturn = 0 then Transaction.QuantitySold else 0 end) as QuantitySold, SUM(Transaction.returnedQuantity) as returnedQuantity
        FROM transactions AS Transaction
        WHERE transactionDate BETWEEN :startDate AND :endDate AND deletedAt IS NULL
        GROUP BY Transaction.packageId
    ) as Transaction ON Transaction.packageId = Package.id
    LEFT JOIN (
        SELECT Transaction.receiptId, Transaction.packageId, SUM(case when isReturn = 0 then Transaction.QuantitySold else 0 end) as QuantitySold, SUM(Transaction.returnedQuantity) as returnedQuantity
        FROM transactions AS Transaction
        WHERE transactionDate < :startDate AND deletedAt IS NULL
        GROUP BY Transaction.packageId
    ) as TransactionAll ON TransactionAll.packageId = Package.id
    INNER JOIN receipts as Receipt ON Receipt.id = Transaction.receiptId
    WHERE ${conditions.join(' AND ')}
    GROUP BY Package.id
    HAVING transactionAmount > 0`

module.exports = async function(args) {

    let date = args.date

    let conditions = ['1'];
    let replacements = {
        startDate: date.startDate,
        endDate: date.endDate
    };

    if(args.productId) {
        conditions.push('Product.id = :productId');
        replacements.productId = args.productId;
    }
    if(args.searchTerm) {
        conditions.push('(Product.name LIKE :searchTerm OR Package.label LIKE :searchTerm)');
        replacements.searchTerm = `%${args.searchTerm}%`;
    }

    if(args.userId){
        conditions.push('Receipt.userId = :userId');
        replacements.userId = args.userId;
    }

    const report = await sequelize.query( packageQuery(conditions), {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT
        // ,logging: console.log
    });

    let reportData = [ ]

    report.forEach(row => {
        row.Quantity = row.ReceivedQuantity - row.transactionAmountAll + row.returnedAmountAll + row.adjustmentAmountAll;
        row.costPerUnit = row.wholesalePrice / row.ReceivedQuantity;

        if(args.export) {

            const reportObj = {
                "Package Label": row.Label,
                "Product Name": row.name,
                "Starting Qty.": `${row.Quantity.toFixed(2)}`,
                "Qty. Purchased": `${(row.transactionAmount-row.returnedAmount).toFixed(2)}`, 
                "Remaining Qty.": `${(row.Quantity-row.transactionAmount+row.returnedAmount+row.adjustmentAmount).toFixed(2)}`,
                "Unit": `${row.UnitOfMeasureAbbreviation}`
            }

            reportData.push(reportObj);
        }
    });

    if (args.export) {
        const csv = Baby.unparse(reportData);
        const date = moment().format('YYYYMMDDHHmmss');

        return await uploadCSVToAws(csv, `reports/inventory-daily-${date}.csv`);
    } else {
        return report;
    }
}
