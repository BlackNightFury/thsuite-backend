const {Package, Item, ProductVariationItem, ProductVariation, Product, ProductType, Supplier, sequelize } = alias.require('@models');
const moment = require('moment');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils')
const Baby = require('babyparse');

const packageQuery = conditions =>
    `SELECT Item.name, Package.Label, Package.ReceivedQuantity, IFNULL(Adjustment.amount, 0) as adjustmentAmount, IFNULL(Transaction.QuantitySold, 0) as transactionAmount,
        ProductType.category, Package.UnitOfMeasureAbbreviation, ProductType.name as type, Package.wholesalePrice,
        (SELECT price / quantity FROM product_variations WHERE product_variations.productId = Product.id ORDER BY price / quantity DESC LIMIT 1) as valuePerUnit

    FROM packages as Package
    INNER JOIN items as Item ON Item.id = Package.itemId
    INNER JOIN products as Product ON Product.itemId = Item.id
    INNER JOIN product_types AS ProductType ON ProductType.id = Item.productTypeId
    LEFT JOIN (
        SELECT Adjustment.packageId, SUM(Adjustment.amount) as amount
        FROM adjustments AS Adjustment
        WHERE date <= :date
        GROUP BY Adjustment.packageId
    ) as Adjustment ON Adjustment.packageId = Package.id
    LEFT JOIN (
        SELECT Transaction.packageId, SUM(Transaction.QuantitySold) as QuantitySold
        FROM transactions AS Transaction
        WHERE transactionDate <= :date
        GROUP BY Transaction.packageId
    ) as Transaction ON Transaction.packageId = Package.id
    WHERE ${conditions.join(' AND ')}
    HAVING Package.ReceivedQuantity + adjustmentAmount - transactionAmount > 0`

const productQuery = conditions =>
    `SELECT Product.name, IFNULL(Package.ReceivedQuantity, 0) as ReceivedQuantity, IFNULL(Adjustment.amount, 0) as adjustmentAmount, IFNULL(Transaction.QuantitySold, 0) as transactionAmount,
        ProductType.category, Package.UnitOfMeasureAbbreviation, ProductType.name as type, Package.wholesalePrice,
        (SELECT price / quantity FROM product_variations WHERE product_variations.productId = Product.id ORDER BY price / quantity DESC LIMIT 1) as valuePerUnit

    FROM products as Product
    INNER JOIN items as Item ON Item.id = Product.itemId
    INNER JOIN product_types AS ProductType ON ProductType.id = Item.productTypeId
    LEFT JOIN (
        SELECT Product.id, SUM(Adjustment.amount) as amount
        FROM packages AS Package
        JOIN adjustments AS Adjustment ON Adjustment.packageId = Package.id
        JOIN items as Item ON Item.id = Package.itemId
        JOIN products as Product ON Product.itemId = Item.id
        WHERE date <= :date
        GROUP BY Product.id
    ) as Adjustment ON Adjustment.id = Product.id
    LEFT JOIN (
        SELECT Product.id, SUM(Transaction.QuantitySold) as QuantitySold
        FROM packages AS Package
        JOIN transactions AS Transaction ON Transaction.packageId = Package.id
        JOIN items as Item ON Item.id = Package.itemId
        JOIN products as Product ON Product.itemId = Item.id
        WHERE transactionDate <= :date
        GROUP BY Product.id
    ) as Transaction ON Transaction.id = Product.id
    LEFT JOIN (
        SELECT Product.id, Package.UnitOfMeasureAbbreviation as UnitOfMeasureAbbreviation, SUM(Package.ReceivedQuantity) as ReceivedQuantity, SUM(Package.wholesalePrice) as wholesalePrice
        FROM packages AS Package
        JOIN items as Item ON Item.id = Package.itemId
        JOIN products as Product ON Product.itemId = Item.id
        WHERE Package.createdAt <= :date
        GROUP BY Product.id, Package.UnitOfMeasureAbbreviation
    ) as Package ON Package.id = Product.id
    WHERE ${conditions.join(' AND ')}
    HAVING ReceivedQuantity + adjustmentAmount - transactionAmount > 0`

const itemQuery = conditions =>
    `SELECT Item.name, IFNULL(Package.ReceivedQuantity, 0) as ReceivedQuantity, IFNULL(Adjustment.amount, 0) as adjustmentAmount, IFNULL(Transaction.QuantitySold, 0) as transactionAmount,
        ProductType.category, Package.UnitOfMeasureAbbreviation, ProductType.name as type, Package.wholesalePrice,
        (SELECT price / quantity FROM product_variations WHERE product_variations.productId = Product.id ORDER BY price / quantity DESC LIMIT 1) as valuePerUnit

    FROM items as Item
    JOIN products as Product ON Product.itemId = Item.id
    INNER JOIN product_types AS ProductType ON ProductType.id = Item.productTypeId
    LEFT JOIN (
        SELECT Item.id, SUM(Adjustment.amount) as amount
        FROM packages AS Package
        JOIN adjustments AS Adjustment ON Adjustment.packageId = Package.id
        JOIN items as Item ON Item.id = Package.itemId
        WHERE date <= :date
        GROUP BY Item.id
    ) as Adjustment ON Adjustment.id = Item.id
    LEFT JOIN (
        SELECT Item.id, SUM(Transaction.QuantitySold) as QuantitySold
        FROM packages AS Package
        JOIN transactions AS Transaction ON Transaction.packageId = Package.id
        JOIN items as Item ON Item.id = Package.itemId
        WHERE transactionDate <= :date
        GROUP BY Item.id
    ) as Transaction ON Transaction.id = Item.id
    LEFT JOIN (
        SELECT Item.id, Package.UnitOfMeasureAbbreviation as UnitOfMeasureAbbreviation, SUM(Package.ReceivedQuantity) as ReceivedQuantity, SUM(Package.wholesalePrice) as wholesalePrice
        FROM packages AS Package
        JOIN items as Item ON Item.id = Package.itemId
        WHERE Package.createdAt <= :date
        GROUP BY Item.id, Package.UnitOfMeasureAbbreviation
    ) as Package ON Package.id = Item.id
    WHERE ${conditions.join(' AND ')}
    HAVING ReceivedQuantity + adjustmentAmount - transactionAmount > 0`


module.exports = async function(args) {

    let date = args.date

    let conditions = ['1'];
    let replacements = {
        date: date
    };

    if(args.productId) {
        conditions.push('Product.id = :productId');
        replacements.productId = args.productId;
    }
    if(args.searchTerm) {
        if (args.reportType === 'package') {
          conditions.push('Package.Label LIKE :searchTerm');
        } else {
          conditions.push('Product.name LIKE :searchTerm');
        }
        
        replacements.searchTerm = `%${args.searchTerm}%`;
    }

    if(args.productTypeId){
        conditions.push('Item.productTypeId = :productTypeId');
        replacements.productTypeId = args.productTypeId;
    }

    if(args.supplierId){
        conditions.push('Item.supplierId = :supplierId');
        replacements.supplierId = args.supplierId;
    }

    if(args.cannabisFilter && args.cannabisFilter != 'all'){
        conditions.push('ProductType.category = :cannabisFilter');
        replacements.cannabisFilter = args.cannabisFilter;
    }

    let report;

    if(args.reportType === 'package' ) {
        conditions.push('Package.deletedAt IS NULL');
        report = await sequelize.query( packageQuery(conditions), {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT
        });
    } else if(args.reportType === 'product') {
        conditions.push('Product.deletedAt IS NULL');
        report = await sequelize.query( productQuery(conditions), {
            logging: console.log,
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT
        });
    } else if(args.reportType === 'item') {
        conditions.push('Item.deletedAt IS NULL');
        report = await sequelize.query( itemQuery(conditions), {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT
        });
    }

    const reportData = [ ]

    report.forEach(row => {
        row.Quantity = row.ReceivedQuantity - row.transactionAmount;
        row.costPerUnit = row.wholesalePrice / row.ReceivedQuantity;

        if(args.export) {

            let reportObj = {}

            if(args.reportType === 'package') {
                reportObj = {
                    "Package Label": row.Label,
                    "Quantity": `${row.Quantity.toFixed(2)}`,
                    "Unit": `${row.UnitOfMeasureAbbreviation}`,
                    "Category": row.category,
                    "Product Name": row.name,
                    "Cost Per Unit": Utils.toDollarValue(row.costPerUnit),
                    "Value Per Unit": Utils.toDollarValue(row.valuePerUnit),
                    "Total Value": Utils.toDollarValue(row.valuePerUnit * row.Quantity),
                    "Potential Profit For Unit": Utils.toDollarValue(row.valuePerUnit - row.costPerUnit),
                    "Total Potential Profit": Utils.toDollarValue( (row.valuePerUnit - row.costPerUnit) * row.Quantity )
                }
            } else {
                reportObj = {
                    "Product Name": row.name,
                    "Quantity": `${row.Quantity.toFixed(2)}`,
                    "Unit": `${row.UnitOfMeasureAbbreviation}`,
                    "Category": row.category,
                    "Product Type": row.type,
                    "Cost Per Unit": Utils.toDollarValue(row.costPerUnit),
                    "Value Per Unit": Utils.toDollarValue(row.valuePerUnit),
                    "Total Value": Utils.toDollarValue(row.valuePerUnit * row.Quantity),
                    "Potential Profit For Unit": Utils.toDollarValue(row.valuePerUnit - row.costPerUnit),
                    "Total Potential Profit": Utils.toDollarValue( (row.valuePerUnit - row.costPerUnit) * row.Quantity )
                }
            }

            reportData.push(reportObj);
        }
    });

    if(args.export) {
        let csv = Baby.unparse(reportData);

        const date = moment().format('YYYYMMDDHHmmss');
        return await uploadCSVToAws(csv, `reports/inventory-breakdown-by-${args.reportType}-${date}.csv`);
    } else {
        return report;
    }


}
