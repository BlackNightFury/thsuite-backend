const { sequelize } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils');

module.exports = async function(args) {
    let replacements = {
        startDate: args.dateRange.startDate,
        endDate: args.dateRange.endDate
    };

    let query = '';

    if (args.report == "sales-by-product-type"){
        query = `
             SELECT pt.id, pt.cannabisCategory, pt.name, sum(t.totalPrice) as sum, sum(1) as count
            FROM packages p
            INNER JOIN transactions t ON
                t.packageId = p.id
            INNER JOIN items i ON
                p.itemId = i.id
            INNER JOIN product_types pt ON
                pt.id = i.productTypeId
            INNER JOIN receipts r ON
                r.id = t.receiptId
            WHERE t.transactionDate BETWEEN :startDate AND :endDate
        `;
    } else if (args.report == "bestselling-product-types"){
        query = `
             SELECT pt.id, pt.cannabisCategory, pt.name, sum(t.totalPrice) as sum, sum(1) as count
            FROM packages p
            INNER JOIN transactions t ON
                t.packageId = p.id
            INNER JOIN items i ON
                p.itemId = i.id
            INNER JOIN product_types pt ON
                pt.id = i.productTypeId
            INNER JOIN receipts r ON
                r.id = t.receiptId
            WHERE t.transactionDate BETWEEN :startDate AND :endDate
        `;
    }

    if (args.filters && args.filters.userId) {
        query += ' AND r.userId = :userId';
        replacements['userId'] = args.filters.userId;
    }

    if (args.filters && args.filters.productTypeId) {
        query += ' AND i.productTypeId = :productTypeId';
        replacements['productTypeId'] = args.filters.productTypeId;
    }

    query += ' GROUP BY pt.id, pt.cannabisCategory, pt.name';

    if (args.report == "bestselling-product-types"){
        query += ' ORDER BY sum DESC';
    }

    const data = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: replacements
    });

    let reportData = [];

    for(let row of data){
        const reportObj = {
            "Product Type": row.name,
            "Avg Per Sale": Utils.toDollarValue(row.sum / row.count),
            "# Of Sales": row.count,
            "Total": Utils.toDollarValue(row.sum)
        };

        reportData.push(reportObj);
    }

    const csv = Baby.unparse(reportData);

    return await uploadCSVToAws(csv, `reports/${args.report}-${moment().format('YYYYMMDDHHmmss')}.csv`);
};
