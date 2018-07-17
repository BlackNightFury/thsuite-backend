require('../../../init');

const {Package, Transaction, Discount, User} = alias.require('@models');
const moment = require('moment');

module.exports = async function(){

    //This handles all post processing of data that is needed when using development/sandbox data from Metrc

    //Transaction dummy dates, discount IDs and amount, user IDs
    console.log("Setting dummy data for transactions");


    let discounts = await Discount.findAll();

    let users = await User.findAll();

    let transactions = await Transaction.findAll();

    let today = moment().format('d');

    let transactionsPerDay = Math.floor(transactions.length / today);

    let day = 1;
    let dayTransactions = 0;

    for(let transaction of transactions) {

        let minutes = Math.floor(Math.random() * 60);
        let hour = Math.floor(Math.random() * 24);
        hour = ('0' + hour).slice(-2);
        minutes = ('0' + minutes).slice(-2);
        let dayString = ('0' + day).slice(-2);

        let dateString = '2017-10-'+ dayString +'T'+ hour +':' + minutes +':00Z';

        let date = moment.utc(dateString).toDate();


        //Select random user
        let user = users[Math.floor(Math.random() * users.length)];

        transaction.userId = user.id;
        //Only apply for 30% of transactions
        let roll = Math.floor(Math.random() * 100);
        if(roll <= 30 && discounts.length){
            let discount = discounts[Math.floor(Math.random() * discounts.length)];
            let discountAmount = transaction.TotalPrice * 0.30;
            transaction.discountId = discount.id;
            transaction.discountAmount = discountAmount;
        }

        //Spread out date over a month
        transaction.transactionDate = date;

        await transaction.save();

        dayTransactions++;


        if(dayTransactions == transactionsPerDay){
            day += 1;
            dayTransactions = 0;
        }
    }

};

if(require.main == module) {
    module.exports()
}

