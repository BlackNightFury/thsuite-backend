const { ProductType, sequelize } = alias.require('@models');
const moment = require('moment');


module.exports = async function(args) {

    const mode = args.mode || 'all';
    const startDate = args.startDate;
    const endDate = args.endDate;
    const replacements = { startDate, endDate };

    let query;
    let queryRevenue;
    let data = [];

    if (startDate && endDate) {
      if (mode == 'byType') {
          query = `
          SELECT SUM(t.totalPrice) AS totalRevenue, COUNT(DISTINCT r.id) AS totalTransactions, IFNULL(pt.name, pt.cannabisCategory) AS category, SUM(t.QuantitySold) AS quantity, SUM(pv.quantity) AS weight
          FROM transactions t
          LEFT JOIN receipts r ON
              r.id = t.receiptId
          INNER JOIN patients p ON
              p.id = r.patientId
          LEFT JOIN products ON
              products.id = t.productId
          LEFT JOIN product_types pt ON
              products.productTypeId = pt.id
          LEFT JOIN product_variations pv ON
              t.productVariationId = pv.id
          WHERE r.deletedAt IS NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND t.isReturn=0 AND (t.wasReturned=0 OR t.wasReturned IS NULL OR t.returnedQuantity < t.QuantitySold)
          AND (p.firstName != 'Guest' OR p.lastName != 'Patient')
          GROUP BY pt.cannabisCategory
          `
      } else if (mode == 'byCounty') {
            query = `
            SELECT SUM(t.totalPrice) AS totalRevenue, SUM(t.quantitySold) AS totalQuantitySold, COUNT(DISTINCT r.id) AS totalTransactions, COUNT(DISTINCT r.patientId) AS totalPatients, IFNULL(p.county, "") AS patientCounty
            FROM transactions t
            LEFT JOIN receipts r ON
                r.id = t.receiptId
            INNER JOIN patients p ON
                p.id = r.patientId
            WHERE r.deletedAt IS NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND t.isReturn=0 AND (t.wasReturned=0 OR t.wasReturned IS NULL OR t.returnedQuantity < t.QuantitySold)
            AND (p.firstName != 'Guest' OR p.lastName != 'Patient')
            GROUP BY patientCounty
            `
        } else if (mode == 'byMedicalCondition') {
            query = `
            SELECT SUM(t.totalPrice) AS totalRevenue, IFNULL(pc.condition, "") AS patientMedicalCondition, SUM(t.quantitySold) AS quantitySold, products.name AS productName, packages.UnitOfMeasureAbbreviation
            FROM transactions t
            LEFT JOIN receipts r ON
                r.id = t.receiptId
            LEFT JOIN patients p ON
                p.id = r.patientId
            LEFT JOIN products ON
                products.id = t.productId
            LEFT JOIN packages ON
                packages.id = t.packageId
            LEFT JOIN patient_conditions pc ON
    				    pc.patientId = p.id
            WHERE r.deletedAt IS NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND t.isReturn=0 AND (t.wasReturned=0 OR t.wasReturned IS NULL OR t.returnedQuantity < t.QuantitySold)
            AND (p.firstName != 'Guest' OR p.lastName != 'Patient')
            GROUP BY patientMedicalCondition, t.productId, pc.patientId
            `
        } else if (mode == 'total') {
            queryRevenue = `
            SELECT SUM(ABS(t.totalPrice)) AS totalRevenue, SUM(case when pt.category = 'non-cannabis' then 0 else ABS(t.totalPrice) end) AS thcRevenue, SUM(case when pt.category = 'non-cannabis' then ABS(t.totalPrice) else 0 end) AS nonThcRevenue
            FROM transactions t
            LEFT JOIN receipts r ON
                r.id = t.receiptId
            INNER JOIN patients p ON
                p.id = r.patientId
            LEFT JOIN products pr ON
                t.productId = pr.id
            LEFT JOIN product_types pt ON
                pr.productTypeId = pt.id
            WHERE t.transactionDate BETWEEN :startDate AND :endDate AND ((r.deletedAt IS NULL AND t.isReturn=0 AND (t.wasReturned=0 OR t.wasReturned IS NULL OR t.returnedQuantity < t.QuantitySold)) OR (r.deletedAt IS NOT NULL AND t.isReturn=1))
            AND (p.firstName != 'Guest' OR p.lastName != 'Patient')
            `

            query = `
            SELECT COUNT(DISTINCT r.id) AS totalTransactions, COUNT(DISTINCT r.patientId) AS totalPatients
            FROM transactions t
            LEFT JOIN receipts r ON
                r.id = t.receiptId
            INNER JOIN patients p ON
                p.id = r.patientId
            WHERE r.deletedAt IS NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND t.isReturn=0
            AND (p.firstName != 'Guest' OR p.lastName != 'Patient')
            `
        } else {
            query = `
            SELECT SUM(t.totalPrice) AS totalRevenue, COUNT(DISTINCT r.id) AS totalTransactions, COUNT(DISTINCT r.patientId) AS totalPatients, DATE(t.transactionDate) as reportDate
            FROM transactions t
            LEFT JOIN receipts r ON
                r.id = t.receiptId
            INNER JOIN patients p ON
                p.id = r.patientId
            WHERE r.deletedAt IS NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND t.isReturn=0 AND (t.wasReturned=0 OR t.wasReturned IS NULL OR t.returnedQuantity < t.QuantitySold)
            AND (p.firstName != 'Guest' OR p.lastName != 'Patient')
            GROUP BY reportDate ORDER BY reportDate ASC
            `
        }
    }

    if (queryRevenue) {
        data = await sequelize.query(queryRevenue, {
            type: sequelize.QueryTypes.SELECT,
            replacements: replacements
            // ,logging: console.log
        });
    }

    if (query) {
        if (data.length) {
            const data2 = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: replacements
                // ,logging: console.log
            });

            data[0] = Object.assign({}, data[0], data2[0]);
        } else {
            data = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
                replacements: replacements
                // ,logging: console.log
            });
      }
    }

    return data;
};
