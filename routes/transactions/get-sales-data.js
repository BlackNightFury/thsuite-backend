const { sequelize } = alias.require('@models');
const moment = require('moment');
const Common = require('./common')

module.exports = async function(args) {

    const startDate = args.startDate;
    const endDate = args.endDate;

    const gross = (await sequelize.query(Common.SalesQuery, Common.QueryOptions(startDate, endDate)))[0];
    const discounts = (await sequelize.query(Common.DiscountQuery, Common.QueryOptions(startDate, endDate)))[0];
    const taxes = (await sequelize.query(Common.TaxQuery, Common.QueryOptions(startDate, endDate)))[0];
    const returns = (await sequelize.query(Common.ReturnsQuery, Common.QueryOptions(startDate, endDate)))[0];
    const receiptCount = (await sequelize.query(Common.ReceiptCountQuery, Common.QueryOptions(startDate, endDate)))[0];
    const cogsAll = (await sequelize.query(Common.CostsOfGoodsSoldQuery, Common.QueryOptions(startDate, endDate)))[0];
    let cogs = (await sequelize.query(Common.CostsOfGoodsSoldQueryWithWholsesalePrice, Common.QueryOptions(startDate, endDate)))[0];

    const cashTrx = (await sequelize.query(Common.CashTransactionsQuery, Common.QueryOptions(startDate, endDate)))[0];
    const giftCardTrx = (await sequelize.query(Common.GiftCardTransactionsQuery, Common.QueryOptions(startDate, endDate)))[0];

    //Baron is removing discounts from these sums because discounts are already factored into the transaction totalPrice.
    //Joe is changing gross - returns to gross + returns because TotalPrice is negative for returns so returns is already a negative number
    const net = {
        cannabisSum: gross.cannabisSum + returns.cannabisSum  - taxes.cannabisSum,
        nonCannabisSum: gross.nonCannabisSum + returns.nonCannabisSum  - taxes.nonCannabisSum,
        count: -1 //Count makes no sense on net sales -- count of what?
    };

    //Gross Margin needs to be calculated with the net sales totals, not the gross sales (gross includes tax and is not an accurate count)
    //Gross Margin = (Net - COGS) / Net
    const gm = {
        cannabis: Math.round((((net.cannabisSum - cogs.cannabisSum)/net.cannabisSum)*10000))/100 || 0,
        nonCannabis: Math.round((((net.nonCannabisSum - cogs.nonCannabisSum)/net.nonCannabisSum)*10000))/100 || 0,
        total: Math.round(((((net.cannabisSum + net.nonCannabisSum) - (cogs.cannabisSum + cogs.nonCannabisSum))/(net.cannabisSum+net.nonCannabisSum))*10000))/100 || 0,
    }

    if (cogs.cannabisCount !== cogsAll.cannabisCount || cogs.nonCannabisCount !== cogsAll.nonCannabisCount) {
        cogs.missingWholesalePrice = true;
    }

    return { gross, discounts, returns, taxes, net, cogs, gm, cashTrx, giftCardTrx, receiptCount };
};
