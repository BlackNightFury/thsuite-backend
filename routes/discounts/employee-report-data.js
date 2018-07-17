const { User, sequelize } = alias.require('@models');
const moment = require('moment');
const Common = require('./common')

module.exports = async function(args){


    let data = await sequelize.query( Common.ByEmployeeQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate: args.startDate,
            endDate: args.endDate
        }
    });


    //Get users and find ones with 0 sales
    let allUsers = await User.findAll();

    let discountUsers = [];
    for(let row of data){
        if(discountUsers.indexOf(row['userId']) == -1){
            discountUsers.push(row['userId']);
        }
    }

    if(discountUsers.length != allUsers.length){
        for(let user of allUsers){
            if(discountUsers.indexOf(user.id) == -1){
                let row = {
                    first: user.firstName,
                    last: user.lastName,
                    amount: 0,
                    taxAmount: 0,
                    count: 0,
                    totalPrice: 0
                };

                data.push(row);
            }
        }
    }

    Common.addTotal(data)

    return data;
}
