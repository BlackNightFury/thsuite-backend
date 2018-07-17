const {Package, Item, ProductVariationItem, ProductVariation, Product, ProductType, Supplier, sequelize } = alias.require('@models');
const moment = require('moment');

module.exports = async function(args) {
    let startDate;
    let endDate;
    if(args.timeFrame == 'custom'){
        if(args.dates.start){
            startDate = moment(args.dates.start).format('YYYY-MM-DD 00:00:00');
        } else {
            startDate = moment().format('YYYY-MM-DD 00:00:00');
        }

        if(args.dates.end){
            endDate = moment(args.dates.end).format('YYYY-MM-DD 00:00:00');
        } else {
            endDate = moment().add(8, 'day').format('YYYY-MM-DD 00:00:00');
        }
    } else if(args.timeFrame == 'thisWeek') {
        //Find sunday
        startDate = moment().startOf('week').format('YYYY-MM-DD 00:00:00');
        endDate = moment().format('YYYY-MM-DD 00:00:00');
    } else if(args.timeFrame == 'lastWeek') {
        startDate = moment().startOf('week').subtract(7, 'day').format('YYYY-MM-DD 00:00:00');
        endDate = moment().startOf('week').subtract(1, 'day').format('YYYY-MM-DD 00:00:00');
    } else if(args.timeFrame == 'thisMonth') {
        startDate = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
        endDate = moment().endOf('month').add(1,'day').format('YYYY-MM-DD 00:00:00');
    } else {
        startDate = moment().startOf('week').format('YYYY-MM-DD 00:00:00');
        endDate = moment().format('YYYY-MM-DD 00:00:00');
    }

    let soldDuringSql = `
        SELECT t.packageId, p.SourceHarvestNames, d.name, t.discountAmount, CONCAT(YEAR(t.transactionDate), '-', MONTH(t.transactionDate), '-', DAY(t.transactionDate)) as date, 
            t.PackageLabel,  sum(t.QuantitySold) as quantity, sum(t.TotalPrice) as TotalPrice
        FROM transactions t
        INNER JOIN packages p ON p.id = t.packageId
        INNER JOIN discounts d ON d.id = t.discountId
        WHERE t.transactionDate >= "${startDate}" AND t.transactionDate <= "${endDate}" 
        GROUP BY YEAR(t.transactionDate), MONTH(t.transactionDate), DAY(t.transactionDate), t.packageId
    `;

    let sales = await
        sequelize.query(soldDuringSql, {
            type: sequelize.QueryTypes.SELECT
        });

    return sales;
}