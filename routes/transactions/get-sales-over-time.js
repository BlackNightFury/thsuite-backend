const { Receipt, LineItem, Transaction, sequelize } = alias.require('@models');
const moment = require('moment');

module.exports = async function(args) {
    console.log("args");
    console.log(args);

    // Timezones are weird
    // Parse out just the date and query for transactions between that date at 00:00:00 to date at 23:59:59

    console.log(args.startDate);
    console.log(args.endDate);

    let receiptWhere = {
        createdAt: {
            $between: [
                args.startDate,
                args.endDate
            ]
        }
    };

    let receipts = await Receipt.findAll({
        where: receiptWhere,
        include: [
            {
                model: LineItem,
                include: [
                    {
                        model: Transaction,
                    }
                ]
            },
        ],
        order: [['createdAt', 'DESC']]
    });

    console.log("RECEIPTS");

    let receiptData = [];
    for (let eachReceipt of receipts){
        var amountSold = 0;
        for (let eachLineItem of eachReceipt.LineItems){
            for (let eachTransaction of eachLineItem.Transactions){
                amountSold += eachTransaction.TotalPrice;
            }
        }
        receiptData.push({'receiptDate': eachReceipt.createdAt, 'totalPrice': amountSold});
    }

    let finalData = {};

    /* identify number of days */

    let startDate = moment.utc(args.startDate);
    let endDate = moment.utc(args.endDate);
    let numOfDays = endDate.diff(startDate, 'days') + 1;

    /* change summation of receipts/transactions based on granularity*/

    // This will bin all transactions that occur between HH:00 and HH:59 into one bin for the hour
    if(args.granularity == "hour") {
        for (let row of receiptData) {

            let hour = moment.utc(row['receiptDate']).hour();
            let dateKey = moment.utc(row['receiptDate']).set({hour: hour, minute: 0, second: 0}).format();
            if (!finalData[dateKey]) {
                finalData[dateKey] = {
                    dollars: 0,
                    receiptCount: 0
                };
            }
            finalData[dateKey].dollars += row['totalPrice'];
            finalData[dateKey].receiptCount += 1;
        }

        //Fill in the blanks
        let currentTime = startDate.clone();
        console.log("Starting Date/Time: " + currentTime.format());
        for (let day = 0; day < numOfDays; day++){
            for (let hour = 0; hour < 24; hour++) {
                let dateKey = currentTime.format();
                if (!finalData[dateKey]) {
                    finalData[dateKey] = {
                        dollars: 0,
                        receiptCount: 0
                    };
                }

                currentTime.add(1,'h');
            }
        }

        /* Add one extra datapoint for date labelling formatting */
        // finalData[currentTime.format()] = {dollars: 0, receiptCount: 0};

        console.log("Ending Date/Time: " + currentTime.format());

        console.log(finalData);
    } else if(args.granularity == "day"){
        let currentDay = startDate.clone().set({hour: startDate.hour()+12, minute: 0, second: 0, millisecond: 0});
        console.log("Starting Date/Time: " + currentDay.format());
        for (let day = 0; day < numOfDays; day++){
            finalData[currentDay.format()] = {dollars: 0, receiptCount: 0};
            for (let row of receiptData){
                let recDate = moment.utc(row['receiptDate']);
                console.log("recDate: " + recDate.format("MM/DD/YY h:mm a") +
                            " vs. current Day: " + currentDay.format("MM/DD/YY h:mm a") );
                if ( Math.abs(recDate.diff(currentDay,'hours')) < 12 ) {
                    finalData[currentDay.format()].dollars += row['totalPrice'];
                    finalData[currentDay.format()].receiptCount += 1;
                }
            }
            console.log(currentDay.format());
            currentDay.add(1, 'day');
        }
    } else if(args.granularity == "week"){
        let currentWeek = startDate.clone().set({day: startDate.day()+ 3, hour: startDate.hour()+12, minute: 0, second: 0, millisecond: 0});
        console.log("Starting Date/Time: " + currentWeek.format());
        for (let week = 0; week < numOfDays/7; week++){
            finalData[currentWeek.format()] = {dollars: 0, receiptCount: 0};
            for (let row of receiptData){
                let recDate = moment.utc(row['receiptDate']);
                console.log("recDate: " + recDate.format("MM/DD/YY h:mm a") +
                    " vs. current Day: " + currentWeek.format("MM/DD/YY h:mm a") );
                if ( Math.abs(recDate.diff(currentWeek,'hours')) < 84 ) {
                    finalData[currentWeek.format()].dollars += row['totalPrice'];
                    finalData[currentWeek.format()].receiptCount += 1;
                }
            }
            console.log(currentWeek.format());
            currentWeek.add(1, 'week');
        }
    }

    console.log(finalData);
    //console.log("Number of Days: " + numOfDays);
    return finalData ;
};

