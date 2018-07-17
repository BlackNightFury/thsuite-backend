const { sequelize, User } = alias.require('@models');
const uploadPdfToAws = alias.require('@lib/aws/uploadPdfToAws');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Common = require('./common');
const Utils = alias.require('@lib/Utils')
const moment = require('moment')
const Baby = require('babyparse');

module.exports = async function(args) {

    let data = null;

    if(args.report === 'sales') {
        const startDate = args.dateRange.startDate,
            endDate = args.dateRange.endDate;

        // Logic must be in-sync with /routes/transactions/get-sales-data.js
        const [ sales, discounts, taxes, returns, receiptCount, cogsAll, cogs, cashTrx, giftCardTrx ] = await Promise.all( [
            sequelize.query(Common.SalesQuery, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.DiscountQuery, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.TaxQuery, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.ReturnsQuery, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.ReceiptCountQuery, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.CostsOfGoodsSoldQuery, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.CostsOfGoodsSoldQueryWithWholsesalePrice, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.CashTransactionsQuery, Common.QueryOptions(startDate, endDate)),
            sequelize.query(Common.GiftCardTransactionsQuery, Common.QueryOptions(startDate, endDate)),
        ] );

        const net = {
            cannabisSum: sales[0].cannabisSum + returns[0].cannabisSum - taxes[0].cannabisSum,
            nonCannabisSum: sales[0].nonCannabisSum + returns[0].nonCannabisSum - taxes[0].nonCannabisSum,
            count: -1 //Count makes no sense on net sales -- count of what?
        };

        // const gm = {
        //     cannabis: Math.round((((net.cannabisSum - cogs.cannabisSum)/net.cannabisSum)*10000))/100 || 0,
        //     nonCannabis: Math.round((((net.nonCannabisSum - cogs.nonCannabisSum)/net.nonCannabisSum)*10000))/100 || 0,
        //     total: Math.round(((((net.cannabisSum + net.nonCannabisSum) - (cogs.cannabisSum + cogs.nonCannabisSum))/(net.cannabisSum+net.nonCannabisSum))*10000))/100 || 0,
        // }

        const gm = {
            cannabis: Math.round((((net.cannabisSum - cogs[0].cannabisSum)/net.cannabisSum)*10000))/100 || 0,
            nonCannabis: Math.round((((net.nonCannabisSum - cogs[0].nonCannabisSum)/net.nonCannabisSum)*10000))/100 || 0,
            total: Math.round(((((net.cannabisSum + net.nonCannabisSum) - (cogs[0].cannabisSum + cogs[0].nonCannabisSum))/(net.cannabisSum + net.nonCannabisSum))*10000))/100 || 0,
        };

        if (cogs[0].cannabisCount !== cogsAll[0].cannabisCount || cogs[0].nonCannabisCount !== cogsAll[0].nonCannabisCount) {
            cogs[0].missingWholesalePrice = true;
        }

        let reportData = [
            { "Type": 'Gross Sales', "Cannabis": Utils.toDollarValue(sales[0].cannabisSum), "Non-Cannabis": Utils.toDollarValue(sales[0].nonCannabisSum), "Total": Utils.toDollarValue(sales[0].cannabisSum + sales[0].nonCannabisSum) },
            { "Type": 'Discounts', "Cannabis": Utils.toDollarValue(discounts[0].cannabisSum), "Non-Cannabis": Utils.toDollarValue(discounts[0].nonCannabisSum), "Total": Utils.toDollarValue(discounts[0].cannabisSum + discounts[0].nonCannabisSum) },
            { "Type": 'Returns', "Cannabis": Utils.toDollarValue(returns[0].cannabisSum), "Non-Cannabis": Utils.toDollarValue(returns[0].nonCannabisSum), "Total": Utils.toDollarValue(returns[0].cannabisSum + returns[0].nonCannabisSum) },
            { "Type": 'Taxes', "Cannabis": Utils.toDollarValue(taxes[0].cannabisSum), "Non-Cannabis": Utils.toDollarValue(taxes[0].nonCannabisSum), "Total": Utils.toDollarValue(taxes[0].cannabisSum + taxes[0].nonCannabisSum) },
            { "Type": 'Net Sales', "Cannabis": Utils.toDollarValue(net.cannabisSum), "Non-Cannabis": Utils.toDollarValue(net.nonCannabisSum), "Total": Utils.toDollarValue(net.cannabisSum + net.nonCannabisSum) },
            { "Type": 'Net COGS'+(cogs[0].missingWholesalePrice ? ' (missing price)' : ''), "Cannabis": Utils.toDollarValue(cogs[0].cannabisSum), "Non-Cannabis": Utils.toDollarValue(cogs[0].nonCannabisSum), "Total": Utils.toDollarValue(cogs[0].cannabisSum + cogs[0].nonCannabisSum) },
            { "Type": 'Gross Margin', "Cannabis": gm.cannabis+'%', "Non-Cannabis": gm.nonCannabis+'%', "Total": gm.total+'%' },
            { "Type": 'Cash Transactions', "Cannabis": Utils.toDollarValue(cashTrx[0].cannabisSum), "Non-Cannabis": Utils.toDollarValue(cashTrx[0].nonCannabisSum), "Total": Utils.toDollarValue(cashTrx[0].cannabisSum + cashTrx[0].nonCannabisSum) },
            { "Type": 'Gift Card Transactions', "Cannabis": Utils.toDollarValue(giftCardTrx[0].cannabisSum), "Non-Cannabis": Utils.toDollarValue(giftCardTrx[0].nonCannabisSum), "Total": Utils.toDollarValue(giftCardTrx[0].cannabisSum + giftCardTrx[0].nonCannabisSum) }
        ];

        const date = moment().format('YYYYMMDDHHmmss');

        if (args.type && args.type == 'pdf') {

            reportData[0]["Transactions"] = receiptCount[0].count;

            console.log('Generating report now...');
            console.log(reportData);

            const html = await Promise.fromCallback(callback => {
                const ejs = require('ejs');
                return ejs.renderFile(__dirname + '/../../view/reports/sales-index-report.ejs', { reportData }, callback);
            });

            return await uploadPdfToAws(html, "reports-overall-sales-"+date+".pdf");
        } else {
            return await uploadCSVToAws(Baby.unparse(reportData), "reports-overall-sales-"+date+".csv");
        }

    } else if (args.report == "employees") {

        let data = await sequelize.query(
            Common.EmployeeSalesDataQuery,
            Common.QueryOptions( args.dateRange.startDate, args.dateRange.endDate )
        )

        //Get users and find ones with 0 sales
        let allUsers = await User.findAll();

        let salesUsers = [];
        for(let row of data){
            if(salesUsers.indexOf(row['userId']) == -1){
                salesUsers.push(row['userId']);
            }
        }

        if(salesUsers.length != allUsers.length){
            for(let user of allUsers){
                if(salesUsers.indexOf(user.id) == -1){
                    let row = {
                        first: user.firstName,
                        last: user.lastName,
                        amount: 0,
                        count: 0
                    };

                    data.push(row);
                }
            }
        }

        const reportData = [ ]
        for(let row of data){
            let reportObj = {
                "Employee": `${row.first} ${row.last}`,
                "Avg Per Sale": row.count == 0 ? 0 : Utils.toDollarValue( row.amount / row.count ),
                "Sales Made": row.count,
                "Total": Utils.toDollarValue(row.amount )
            };

            reportData.push(reportObj);
        }

        let csv = Baby.unparse(reportData);

        const date = moment().format('YYYYMMDDHHmmss');
        return await uploadCSVToAws(csv, "reports/sales-by-employee-"+date+".csv");

    } else if (args.report == "peak-sales") {

        let data = await Common.handlePeakSales(args, args.timeZone)
        let tableData = [ ]
        const reportData = [ ]

        if(args.mode == 'dow'){

            tableData = Common.processDoWData(data,args);

            for(let row of tableData){
                let reportObj = {
                    "Day Of Week": row.day,
                    "Busiest Time of Day": row.busiest,
                    "Top Product": row.product,
                    "Total": Utils.toDollarValue(row.revenue )
                };

                reportData.push(reportObj);
            }

		} else {
			tableData = Common.processToDData(data, args);

            for(let row of tableData){
                let reportObj = {
                    "Time Of Day": row.hour,
                    "Busiest Time of Day": row.busiest,
                    "Top Product": row.product,
                    "Total": Utils.toDollarValue(row.revenue )
                };

                reportData.push(reportObj);
            }
		}

        let csv = Baby.unparse(reportData);

        const date = moment().format('YYYYMMDDHHmmss');
        const report = args.mode == 'dow' ? 'day-of-week' : 'time-of-day'
        return await uploadCSVToAws(csv, `reports/sales-by-${report}-${date}.csv`);

    } else if (args.report == "daily") {

        let data = await Common.getDailySales(args)
        const reportData = [ ]

        if (Object.keys(data).length) {
            let total = 0;

            let keys = Object.keys(data);

            keys.sort();

            keys.forEach(key => {

                const timeStart = moment(key).format('h:mm a');
                const timeEnd = moment(key).add(59, 'minutes').format('h:mm a');

                const amount = Utils.toDollarValue(data[key]);

                // Keep total for tableData
                total += data[key];
                reportData.push({
                    "Hour": `${timeStart} - ${timeEnd}`,
                    "Total Sales": amount
                });
            });
        }

        let csv = Baby.unparse(reportData);

        return await uploadCSVToAws(csv, `reports-sales-daily-${moment(args.date).format('YYYYMMDD')}.csv`)

    } else if( args.report == "inventory-breakdown"){
        let report = "";
        if (args == "sales") {
            report = "sales";
            data = await sequelize.query(`
                SELECT sum(t.totalPrice) as sum, sum(1) as count
                FROM packages p
                INNER JOIN transactions t ON
                    t.packageId = p.id
                INNER JOIN items i ON
                    p.itemId = i.id;
            `, {
                type: sequelize.QueryTypes.SELECT
            });
        } else if (args == "employees") {
            report = "employees";
            data = await sequelize.query(`
                 SELECT x.first as first, x.last as last, SUM(x.transactionAmount) as amount, count(1) as count
                    FROM
                        (SELECT u.id as userId, u.firstName as first, u.lastName as last, t.totalPrice as transactionAmount
                        FROM packages p
                        INNER JOIN transactions t ON
                            t.packageId = p.id
                        INNER JOIN items i ON
                            p.itemId = i.id
                        INNER JOIN users u ON
                            t.userId = u.id
                        ) AS x
                    GROUP BY x.userId;
            `, {
                type: sequelize.QueryTypes.SELECT
            });
        }
        else if (args.report == "daily") {

            report = "daily";
            data = await sequelize.query(`
                 SELECT t.transactionDate as date, t.totalPrice as price
                    FROM packages p
                    INNER JOIN transactions t ON
                        t.packageId = p.id
                    INNER JOIN items i ON
                        p.itemId = i.id
                    WHERE t.transactionDate = "${args.date}"
            `, {
                type: sequelize.QueryTypes.SELECT
            });
            let hour = 0;
            let time;
            // const moment = require("moment");
            for (let row of data) {
                let minutes = Math.floor(Math.random() * 60);
                row['date'] = moment.utc(row['date']).add({hour: hour, minutes: minutes});
                hour += 1;
                if (hour == 24) {
                    hour = 0;
                }
            }

            //This will bin all transactions that occur between HH:00 and HH:59 into one bin for the hour
            let finalData = [];
            for (let row of data) {
                let date = moment(row['date']);
                //Get the hour this date belongs to
                let hour = date.hour();
                let dateKey = moment(row['date']).set({hour: hour, minute: 0}).format();
                if (!finalData[dateKey]) {
                    finalData[dateKey] = 0;
                }
                finalData[dateKey] += row['price'];
            }
            let finalerData = [];
            let total = 0;
            for (let row in finalData) {
                let timeStart = moment(row).format('h:mm a');
                let timeEnd = moment(row).add(59, 'minutes').format('h:mm a');
                finalerData.push({"price": finalData[row], "date": timeStart + " - " + timeEnd});
                total += finalData[row];
            }
            finalerData.push({"price": total, "date": "Total"});
            data = finalerData;
        }
    }
};
