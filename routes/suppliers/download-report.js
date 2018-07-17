const { sequelize } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils');

module.exports = async function(args) {
    let data = null;
    if(args.report == "bestselling-brands"){

        data = await sequelize.query(`
            SELECT s.name, sum(t.totalPrice) as sum, sum(1) as count
            FROM suppliers s
            INNER JOIN packages p on p.supplierId = s.id
            INNER JOIN transactions t on
                  t.packageId = p.id
            WHERE t.transactionDate BETWEEN :startDate AND :endDate
            GROUP BY s.name ORDER BY sum DESC
        `, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                startDate: args.dateRange.startDate,
                endDate: args.dateRange.endDate
            }
        });
    }

    let reportData = [];

    for(let row of data){
        let reportObj = {
            "Product Type": row.name,
            "Avg Per Sale": Utils.toDollarValue(row.sum / row.count),
            "# Of Sales": row.count,
            "Total": Utils.toDollarValue(row.sum)
        };
      
        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    return await uploadCSVToAws(csv, `reports/${args.report}-${moment().format('YYYYMMDDHHmmss')}.csv`);

};
