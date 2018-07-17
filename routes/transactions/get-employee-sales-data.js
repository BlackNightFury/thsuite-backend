const { User, sequelize } = alias.require('@models');
const moment = require('moment');
const Common = require('./common')

module.exports = async function(args){

    let data = await sequelize.query( Common.EmployeeSalesDataQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate: args.startDate,
            endDate: args.endDate
        }
    });

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

    //Calculate total amount and total discounts
    let total = {
        first: 'Total',
        last: '',
        amount: 0,
        count: 0
    };

    for (let row of data) {
        total.amount += row['amount'];
        total.count += row['count'];
    }

    data.push(total);

    return data;



}
