const { Receipt, Store, StoreSettings, sequelize } = require('../../models');
const moment = require('moment')
const CommonTransaction = require('../../routes/transactions/common')
const sgMail = require('@sendgrid/mail')
const config = require('../../config');
const Utils = require('../../lib/Utils')

sgMail.setApiKey(config.sendGrid);

module.exports = async () => {

    try {
        let stores = await Store.findAll({ include: [ StoreSettings ] })

        await Promise.all( stores.map( async store => {

            if( !store.StoreSetting || !store.StoreSetting.dailySalesEmailList ) return

            const storeTimeZone = store.timeZone,
                start = moment().tz(storeTimeZone).subtract(1, 'day').startOf('day'),
                startDate = start.utc().format(),
                endDate = moment().tz(storeTimeZone).subtract(1, 'day').endOf('day').utc().format()

            const [ sales, discounts, taxes, returns, receiptCount, receiptAverage ] = await Promise.all( [
                sequelize.query( CommonTransaction.SalesQuery, CommonTransaction.QueryOptions( startDate, endDate ) ),
                sequelize.query( CommonTransaction.DiscountQuery, CommonTransaction.QueryOptions( startDate, endDate ) ),
                sequelize.query( CommonTransaction.TaxQuery, CommonTransaction.QueryOptions( startDate, endDate ) ),
                sequelize.query( CommonTransaction.ReturnsQuery, CommonTransaction.QueryOptions( startDate, endDate ) ),
                Receipt.count( { where: { createdAt: { $between: [ startDate, endDate ]  } } } ),
                sequelize.query(`
                    SELECT AVG(a.receiptTotal) as value
                    FROM (
                        SELECT t.receiptId, (IFNULL(t.totalPrice,0) - IFNULL(r.totalPrice,0) - IFNULL(t.taxAmount,0) + IFNULL(r.taxAmount,0)) as receiptTotal
                        FROM (
                            SELECT t.receiptId, SUM(t.totalPrice) as totalPrice, SUM(tax.amount) as taxAmount
                            FROM transactions t
                            LEFT JOIN ( SELECT transactionId, SUM(amount) as amount FROM transaction_taxes GROUP BY transactionId ) tax ON tax.transactionId = t.id
                            WHERE ( t.isReturn IS FALSE OR t.isReturn IS NULL ) AND t.transactionDate BETWEEN '${startDate}' AND '${endDate}'
                            GROUP BY receiptId
                        ) t LEFT JOIN (
                            SELECT t.receiptId, SUM(t.totalPrice) as totalPrice, SUM(tax.amount) as taxAmount
                            FROM transactions t
                            LEFT JOIN ( SELECT transactionId, SUM(amount) as amount FROM transaction_taxes GROUP BY transactionId ) tax ON tax.transactionId = t.id
                            WHERE t.isReturn IS TRUE AND t.transactionDate BETWEEN '${startDate}' AND '${endDate}'
                            GROUP BY receiptId
                        ) r ON r.receiptId = t.receiptId
                    ) a`
                )
            ] )

            const totalSales = sales[0].cannabisSum + sales[0].nonCannabisSum,
                refunds = returns[0].cannabisSum + returns[0].nonCannabisSum,
                totalTaxes = taxes[0].cannabisSum + taxes[0].nonCannabisSum,
                netSales = totalSales - refunds,
                profit = totalSales - refunds - totalTaxes

            const mailResult = await sgMail.send( {
                to: store.StoreSetting.dailySalesEmailList.trim().split(','),
                from: 'noreply@thsuite.com',
                subject: `${start.format('MM-DD-YYYY')} Daily Sales Summary`,
                html: `<section>
                    <div>Store: ${store.name}</div>
                    <hr/>
                    <div>Sales : ${Utils.toDollar(totalSales)}</div>
                    <div>Refunds : ${Utils.toDollar(refunds)}</div>
                    <div>Net Sales : ${Utils.toDollar(netSales)}</div>
                    <div>Profit : ${Utils.toDollar(profit)}</div>
                    <div>Margin : ${(100 * (profit/netSales)).toFixed(2)}%</div>
                    <div># Receipts : ${receiptCount}</div>
                    <div>Average Receipt : ${Utils.toDollar(receiptAverage[0][0].value)}</div>
                </section>`
            } )
        } ) )
    } catch( e ) {
        console.log(`There was a problem running the daily sales report cron job: ${e.stack || e}`)
        process.exit(0)
    }
};
