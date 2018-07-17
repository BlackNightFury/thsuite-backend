const { sequelize, Product, Transaction } = require('../../models');
const moment = require('moment')
require('moment-timezone')

const fromPackageSubQuery = category =>
    `FROM packages p
    INNER JOIN transactions t ON t.packageId = p.id
    INNER JOIN items i ON p.itemId = i.id
    INNER JOIN product_types pt ON i.productTypeId = pt.id AND pt.category = '${category}'`


module.exports = class Common {

    static get DiscountQuery() {
        return `
        SELECT IFNULL(c.sum,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.sum,0) as nonCannabisSum, nc.count as nonCannabisCount
        FROM (SELECT sum(t.discountAmount) as sum, sum(1) as count
              ${fromPackageSubQuery('cannabis')}
              WHERE t.isReturn IS NOT TRUE AND t.discountAmount IS NOT NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as c,
            (SELECT sum(t.discountAmount) as sum, sum(1) as count
             ${fromPackageSubQuery('non-cannabis')}
             WHERE t.isReturn IS NOT TRUE AND t.discountAmount IS NOT NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as nc`
    }

    static get EmployeeSalesDataQuery() {
        return `
        SELECT x.userId as userId, x.first as first, x.last as last, SUM(x.transactionAmount) as amount, count(1) as count
        FROM
            (SELECT u.id as userId, u.firstName as first, u.lastName as last, t.totalPrice as transactionAmount
            FROM packages p
            INNER JOIN transactions t ON
                t.packageId = p.id
            INNER JOIN receipts r ON
                t.receiptId = r.id
            INNER JOIN items i ON
                p.itemId = i.id
            INNER JOIN users u ON
                r.userId = u.id
            WHERE t.transactionDate BETWEEN :startDate AND :endDate
            ) AS x
        GROUP BY x.userId`
    }

    static get ReturnsQuery() {
        return `
        SELECT IFNULL(c.sum,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.sum,0) as nonCannabisSum, nc.count as nonCannabisCount
        FROM (SELECT IFNULL(sum(t.totalPrice - t.discountAmount),0) as sum, sum(1) as count
            ${fromPackageSubQuery('cannabis')}
            WHERE t.isReturn IS TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL ) as c,
            (SELECT IFNULL(sum(t.totalPrice - t.discountAmount),0) as sum, sum(1) as count
            ${fromPackageSubQuery('non-cannabis')}
            WHERE t.isReturn IS TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL ) as nc`
    }

    static get SalesQuery() {
        return `
        SELECT IFNULL(c.sum,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.sum,0) as nonCannabisSum, nc.count as nonCannabisCount
		FROM (SELECT SUM(t.totalPrice) as sum, SUM(1) as count
              ${fromPackageSubQuery('cannabis')}
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as c,
             (SELECT SUM(t.totalPrice) as sum, SUM(1) as count
              ${fromPackageSubQuery('non-cannabis')}
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as nc`
    }

    static get CostsOfGoodsSoldQueryWithWholsesalePrice() {
        return `
        SELECT IFNULL(c.cogs,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.cogs,0) as nonCannabisSum, nc.count as nonCannabisCount
        FROM (SELECT SUM((p.wholesalePrice / p.ReceivedQuantity) * t.QuantitySold) as cogs, SUM(1) as count
              ${fromPackageSubQuery('cannabis')}
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL AND p.wholesalePrice IS NOT NULL) as c,
             (SELECT SUM((p.wholesalePrice / p.ReceivedQuantity) * t.QuantitySold) as cogs, SUM(1) as count
              ${fromPackageSubQuery('non-cannabis')}
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL AND p.wholesalePrice IS NOT NULL) as nc`
    }

    static get CostsOfGoodsSoldQuery() {
        return `
        SELECT IFNULL(c.cogs,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.cogs,0) as nonCannabisSum, nc.count as nonCannabisCount
        FROM (SELECT SUM((p.wholesalePrice / p.ReceivedQuantity) * t.QuantitySold) as cogs, SUM(1) as count
              ${fromPackageSubQuery('cannabis')}
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as c,
             (SELECT SUM((p.wholesalePrice / p.ReceivedQuantity) * t.QuantitySold) as cogs, SUM(1) as count
              ${fromPackageSubQuery('non-cannabis')}
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as nc`
    }

    //NOTE: The below queries get counts of receipts for cannabis and non cannabis transactions -- this can lead to double counting of total number of transactions
    // as receipts can contain transactions with both cannabis and non cannabis items. At the business level, when number of transactions is needed, that is actually
    // referring to number of receipts -- to get this number use the ReceiptCountQuery which gives you all receipts completed in a time period.

    static get CashTransactionsQuery() {
        return `
        SELECT IFNULL(c.sum,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.sum,0) as nonCannabisSum, nc.count as nonCannabisCount
        FROM (SELECT SUM(t.totalPrice) as sum, COUNT(DISTINCT r.id) as count
              ${fromPackageSubQuery('cannabis')}
              INNER JOIN receipts r ON(t.receiptId = r.id)
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL AND r.paymentMethod="cash") as c,
             (SELECT SUM(t.totalPrice) as sum, COUNT(DISTINCT r.id) as count
              ${fromPackageSubQuery('non-cannabis')}
              INNER JOIN receipts r ON(t.receiptId = r.id)
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL AND r.paymentMethod="cash") as nc`
    }

    static get GiftCardTransactionsQuery() {
        return `
        SELECT IFNULL(c.sum,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.sum,0) as nonCannabisSum, nc.count as nonCannabisCount
        FROM (SELECT SUM(t.totalPrice) as sum, COUNT(DISTINCT r.id) as count
              ${fromPackageSubQuery('cannabis')}
              INNER JOIN receipts r ON(t.receiptId = r.id)
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL AND r.paymentMethod="gift-card") as c,
             (SELECT SUM(t.totalPrice) as sum, COUNT(DISTINCT r.id) as count
              ${fromPackageSubQuery('non-cannabis')}
              INNER JOIN receipts r ON(t.receiptId = r.id)
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL AND r.paymentMethod="gift-card") as nc`
    }

    static get TaxQuery() {
        return `
        SELECT IFNULL(c.sum,0) as cannabisSum, c.count as cannabisCount, IFNULL(nc.sum,0) as nonCannabisSum, nc.count as nonCannabisCount
        FROM (SELECT sum(tax.amount) as sum, sum(1) as count
              ${fromPackageSubQuery('cannabis')}
              INNER JOIN transaction_taxes as tax on tax.transactionId = t.id
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as c,
              (SELECT sum(tax.amount) as sum, sum(1) as count
              ${fromPackageSubQuery('non-cannabis')}
              INNER JOIN transaction_taxes as tax on tax.transactionId = t.id
              WHERE t.isReturn IS NOT TRUE AND t.transactionDate BETWEEN :startDate AND :endDate AND t.deletedAt IS NULL) as nc`
    }

    static get ReceiptCountQuery(){
        return `
        SELECT COUNT(DISTINCT r.id) as count
        FROM receipts AS r
        WHERE r.createdAt BETWEEN :startDate AND :endDate AND r.deletedAt IS NULL`
    }

    static QueryOptions( startDate, endDate ) {
        return {
            type: sequelize.QueryTypes.SELECT,
            replacements: { startDate, endDate }
        }
    }

	static get daysOfWeek() { return [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] }

    static async handlePeakSales(args,timeZone="Etc/UTC") {

        const momentDayKey = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        };

        //Just need all transactions in each time period, processing after
        let transactions = {
            'primary': [],
            'secondary': []
        };

        if(!args.selected.primary && !args.selected.secondary) return {};

        if(args.selected.primary){
            if(args.primaryStart && args.primaryEnd) {

                let data = await Transaction.findAll({
                    attributes: ["id", "transactionDate", "TotalPrice"],
                    where: {
                        transactionDate: {
                            $gte: args.primaryStart,
                            $lte: args.primaryEnd
                        }
                    },
                    include: [
                        {
                            model: Product,
                            attributes: ["id", "name"]
                        }
                    ]
                });

                transactions.primary = data;
            }
        }

        if(args.selected.secondary){
            if(args.secondaryStart && args.secondaryEnd) {

                let secondaryData = await Transaction.findAll({
                    attributes: ["id", "transactionDate", "TotalPrice"],
                    where: {
                        transactionDate: {
                            $gte: args.secondaryStart,
                            $lte: args.secondaryEnd
                        }
                    },
                    include: [
                        {
                            model: Product,
                            attributes: ["id", "name"]
                        }
                    ]
                });

                transactions.secondary = secondaryData;
            }
        }



        let keys = [];

        if(args.selected.primary) keys.push('primary');
        if(args.selected.secondary) keys.push('secondary');

        let finalData = {
            primary: undefined,
            secondary: undefined
        };

        //Once data is pulled
        if(args.mode == 'dow'){

            for(let key of keys){

                let data = transactions[key];

                //DOW means result should be structured like this:
                // data = {
                //     Sunday: {
                //         0: $$$
                //         1: $$$
                //         2: $$$
                //         3: $$$
                //         4: $$$
                //         ...
                //         23: $$$
                //         sum: total $$$ for Sunday
                //         maxHr: 8 -- top hourly sales
                //     }
                //     ...
                // }

                //Initial data setup
                let finalKeyData = {};
                let products = {};
                this.daysOfWeek.forEach(day => {

                    let dayObj = {};
                    for(let i=0; i<24; i++){
                        dayObj[i] = 0;
                    }

                    dayObj.sum = 0;
                    dayObj.maxHr = -1;
                    dayObj.topProd = '';

                    finalKeyData[day] = dayObj;
                    products[day] = {};
                });


                for(let row of data){
                    //Parse this date
                    let rowDate = moment(row.transactionDate).tz(timeZone);
                    //Need the day of the week and the hour
                    let dayOfWeek = momentDayKey[rowDate.day()];
                    let hourOfDay = rowDate.hour();

                    finalKeyData[dayOfWeek][hourOfDay] += row["TotalPrice"];
                    finalKeyData[dayOfWeek].sum += row["TotalPrice"];

                    if(!products[dayOfWeek][row.Product.id]){
                        products[dayOfWeek][row.Product.id] =  {
                            name: row.Product.name,
                            sum: row["TotalPrice"]
                        }
                    }else{
                        products[dayOfWeek][row.Product.id].sum += row["TotalPrice"]
                    }
                }


                //Max Hour calculation
                this.daysOfWeek.forEach(day => {

                    let sales = finalKeyData[day];
                    let maxHr = -1;
                    let maxSales = 0;
                    for(let i = 0; i < 24; i++){
                        let hourSales = sales[i];
                        if(hourSales > maxSales){
                            maxSales = hourSales;
                            maxHr = i;
                        }
                    }

                    sales.maxHr = maxHr;

                });

                //Max product sold calculation
                this.daysOfWeek.forEach(day => {
                    let dayProducts = products[day];
                    let maxSold = 0;
                    let maxProduct = '';
                    Object.keys(dayProducts).forEach(id => {

                        if(dayProducts[id].sum > maxSold){
                            maxSold = dayProducts[id].sum;
                            maxProduct = dayProducts[id].name;
                        }

                    });

                    let sales = finalKeyData[day];

                    sales.topProd = maxProduct;

                });


                finalData[key] = finalKeyData;

            }

            return finalData;


        }else if(args.mode == 'tod'){

            for(let key of keys) {

                let data = transactions[key];

                //TOD means data is structured like this
                // data = {
                //     0: {
                //         Sunday: $$$
                //         Monday: $$$
                //         Tuesday: $$$
                //         ...
                //         Saturday: $$$
                //         sum: total
                //         maxDay: -- max revenue on this day
                //     },
                //     1:
                //     2:
                //     ...
                //     23:
                // }

                let finalKeyData = {};
                let products = {};
                for(let i =0; i<24; i++){
                    let hourObj = {};

                    this.daysOfWeek.forEach(day => {

                        hourObj[day] = 0;
                    });

                    hourObj.sum = 0;
                    hourObj.maxDay = -1;
                    hourObj.topProd = '';

                    finalKeyData[i] = hourObj;
                    products[i] = {};
                }

                for(let row of data){
                    //Parse this date
                    let rowDate = moment(row["transactionDate"]).tz(timeZone);
                    //Need the day of the week and the hour
                    let dayOfWeek = momentDayKey[rowDate.day()];
                    let hourOfDay = rowDate.hour();

                    finalKeyData[hourOfDay][dayOfWeek] += row["TotalPrice"];

                    if(args.dayView && args.dayView != 'all'){
                        //Only add to sum if dayOfWeek is dayView
                        if(dayOfWeek == args.dayView) {
                            finalKeyData[hourOfDay].sum += row["TotalPrice"];
                            if(!products[hourOfDay][row.Product.id]){
                                products[hourOfDay][row.Product.id] =  {
                                    name: row.Product.name,
                                    sum: row["TotalPrice"]
                                }
                            }else{
                                products[hourOfDay][row.Product.id].sum += row["TotalPrice"]
                            }
                        }

                    }else{
                        if(!products[hourOfDay][row.Product.id]){
                            products[hourOfDay][row.Product.id] =  {
                                name: row.Product.name,
                                sum: row["TotalPrice"]
                            }
                        }else{
                            products[hourOfDay][row.Product.id].sum += row["TotalPrice"]
                        }
                        finalKeyData[hourOfDay].sum += row["TotalPrice"];
                    }


                }

                //Max Hour calculation

                for(let i = 0; i < 24; i++){
                    let sales = finalKeyData[i];
                    let maxDay = "";
                    let maxSales = 0;
                    this.daysOfWeek.forEach(day =>{
                       let daySales = sales[day];
                       if(daySales > maxSales){
                           maxSales = daySales;
                           maxDay = day;
                       }

                    });

                    sales.maxDay = maxDay;
                }

                //Max product sold calculation
                for(let i = 0; i < 24; i++){
                    let hourProducts = products[i];
                    let maxSold = 0;
                    let maxProduct = '';

                    Object.keys(hourProducts).forEach(id => {

                        if(hourProducts[id].sum > maxSold){
                            maxSold = hourProducts[id].sum;
                            maxProduct = hourProducts[id].name;
                        }

                    });

                    let sales = finalKeyData[i];

                    sales.topProd = maxProduct;
                }



                finalData[key] = finalKeyData;

            }

            return finalData;


        }else {
            return {};
        }
    }

    static processToDData(data, args) {
		const tableData = []

        for(let i = 0; i < 24; i++) {

            let hourData = data['primary'][i];
            let hour = this.formatHour(i) + ' - ' + this.formatHour(i+1);

            if(args.selected.secondary){
                hourData = data['secondary'][i];
                hour = this.formatHour(i) + ' - ' + this.formatHour(i+1);
            }

            let busiest = hourData.maxDay;

            tableData.push({
                hour: hour,
                busiest: busiest,
                product: hourData.topProd,
                revenue: hourData.sum
            });
        }

        return tableData;
    }

	static formatHour(hour){
        let result;

        if(hour == 12){
            result = "12pm";
        } else if(hour == 0 || hour == 24){
            result = "12am";
        } else if(hour > 12){
            result = (hour - 12) + 'pm';
        }else{
            result = hour + 'am';
        }

        return result;
    }

    static processDoWData(data) {
        const tableData = []

        this.daysOfWeek.forEach(day => {

            let dayData = data['primary'][day];

            if(this.secondaryDateRangeToggle){
                let dayData = data['secondary'][day];
            }

            let busiest;

            if(dayData.maxHr == -1){
                //Day had no sales
                busiest = ''
            }else{
                let topHour = dayData.maxHr;
                let topHourEnd = topHour + 1;

                let topHourString = this.formatHour(topHour);
                let topHourEndString = this.formatHour(topHourEnd);
                busiest = topHourString + ' - ' + topHourEndString
            }

            tableData.push({
                day: day,
                busiest: busiest,
                product: dayData.topProd,
                revenue: dayData.sum
            });

        });

        return tableData

    }

    static async getDailySales(args) {
        let data = await sequelize.query(`
            SELECT t.transactionDate as date, t.totalPrice as price
            FROM packages p
            INNER JOIN transactions t ON
                t.packageId = p.id
            INNER JOIN items i ON
                p.itemId = i.id
            WHERE t.transactionDate BETWEEN :startDate AND :endDate`,
            this.QueryOptions( args.startDate, args.endDate )
        )

        //This will bin all transactions that occur between HH:00 and HH:59 into one bin for the hour
        let finalData = {};
        for(let row of data){

            let dateKey = moment(row.date).tz(args.timeZone).set( { minute: 0, second: 0 } ).format()

            if(!finalData[dateKey]){
                finalData[dateKey] = 0;
            }
            finalData[dateKey] += row['price'];
        }

        //Fill in the blanks
        let startDate = moment(args.startDate).tz(args.timeZone).set({minute:0,second:0})
        for(let hour = 0; hour < 24; hour++){
            let currDate = startDate.add(hour, 'h');
            let dateKey = currDate.format();
            if(!finalData[dateKey]){
                finalData[dateKey] = 0;
            }
            startDate = moment(args.startDate).tz(args.timeZone)
        }

        return finalData;
    }
}
