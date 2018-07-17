
const { ProductType, sequelize } = alias.require('@models');
const moment = require('moment');


module.exports = async function(args) {

    let query = `
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

    let replacements = {
        startDate: args.startDate,
        endDate: args.endDate
    };

    if (args.filters && args.filters.userId) {
        query += ' AND r.userId = :userId';
        replacements['userId'] = args.filters.userId;
    }

    if (args.filters && args.filters.productTypeId) {
        query += ' AND i.productTypeId = :productTypeId';
        replacements['productTypeId'] = args.filters.productTypeId;
    }

    query += ' GROUP BY pt.id, pt.cannabisCategory, pt.name';

    if (args.mode !== undefined &&
            args.mode === 'best-seller') {
        query += ' ORDER BY sum DESC';
    }

    let data = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: replacements
    });

    let total = {
        name: 'Total',
        sum: 0,
        count: 0
    };

    for (let row of data) {
        total.sum += row['sum'];
        total.count += row['count'];
    }

    data.push(total);

    return data;
};
