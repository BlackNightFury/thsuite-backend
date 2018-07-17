const { sequelize } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils');

module.exports = async function(args) {
    let data = null;

    const queryOptions = {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate: args.dateRange.startDate,
            endDate: args.dateRange.endDate
        }
    }

    if(args.report == "sales-by-product"){
        data = await sequelize.query(`
            SELECT i.id, i.name, sum(t.totalPrice) as sum, sum(1) as count
            FROM packages p
            INNER JOIN transactions t on
            t.packageId = p.id
            INNER JOIN items i ON
            p.itemId = i.id
            WHERE t.transactionDate BETWEEN :startDate AND :endDate
            GROUP BY i.id, i.name
        `, queryOptions );
    }else if(args.report == "bestselling-products"){
        data = await sequelize.query(`
            SELECT i.id, i.name, sum(t.totalPrice) as sum, sum(1) as count
            FROM packages p
            INNER JOIN transactions t on
            t.packageId = p.id
            INNER JOIN items i ON
            p.itemId = i.id
            WHERE t.transactionDate BETWEEN :startDate AND :endDate
            GROUP BY i.id, i.name
            ORDER BY sum DESC
        `, queryOptions )
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
