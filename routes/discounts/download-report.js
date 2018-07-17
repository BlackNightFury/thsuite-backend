const { User, sequelize } = alias.require('@models');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Common = require('./common');
const moment = require('moment');
const Utils = alias.require('@lib/Utils')
const Baby = require('babyparse');

module.exports = async function(args) {
    let data = null;

    const queryOptions = {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate: args.dateRange.startDate,
            endDate: args.dateRange.endDate
        }
    }

    const reportData = [ ]

    if(args.report == "discount-overall"){
        data = await sequelize.query( Common.OverallQuery, queryOptions )
        
        for(let row of data){
            let reportObj = {
                "Discount Name": row.name,
                "Uses": row.count || 0,
                "Amount": row.amount ? Utils.toDollarValue(row.amount) : 0,
                "Average Discount Per Use": row.count ? Utils.toDollarValue(row.amount/row.count) : 0,
                "Net Profit": Utils.toDollarValue(row.totalPrice - row.taxAmount - row.cogs)
            };

            reportData.push(reportObj);
        }

    } else  if(args.report == "discount-types"){

        let [ productTypeDiscounts, productDiscounts, packageDiscounts, noneDiscounts ] = await Promise.all( [
            sequelize.query( Common.ByProductTypeQuery, queryOptions ),
            sequelize.query( Common.ByProductQuery, queryOptions ),
            sequelize.query( Common.ByPackageQuery, queryOptions ),
            sequelize.query( Common.ByNoneQuery, queryOptions )
        ] )
        
        let data = productTypeDiscounts.concat(productDiscounts, packageDiscounts, noneDiscounts)
        
        for(let row of data){
            let reportObj = {
                "Discount Entity Type": row.type,
                "Discounted Entity": row.name, 
                "Uses": row.count || 0,
                "Amount Discounted": row.amount ? Utils.toDollarValue(row.amount) : 0,
                "Average Discount Per Use": row.count ? Utils.toDollarValue(row.amount/row.count) : 0,
                "Net Profit": Utils.toDollarValue(row.totalPrice - row.taxAmount - row.cogs)
            };

            reportData.push(reportObj);
        }

    } else  if(args.report == "discount-employees"){
        let data = await sequelize.query( Common.ByEmployeeQuery, queryOptions )

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
                        cogs: 0
                    };

                    data.push(row);
                }
            }
        }

        for(let row of data){
            let reportObj = {
                "Employee": `${row.first} ${row.last}`,
                "Discounts Given": row.count || 0, 
                "Amount Discounted": row.amount ? Utils.toDollarValue(row.amount) : 0,
                "Average Discount Per Use": row.count ? Utils.toDollarValue(row.amount/row.count) : 0,
                "Net Profit": row.totalPrice ? Utils.toDollarValue(row.totalPrice - row.taxAmount - row.cogs) : 0
            };

            reportData.push(reportObj);
        }
    } else if(args.report == "discount-products"){
        let data = await sequelize.query( Common.ByProductQuery, queryOptions )

        for(let row of data){
            let reportObj = {
                "Discount Entity Type": row.type,
                "Discounted Entity": row.name, 
                "Uses": row.count || 0,
                "Amount Discounted": row.amount ? Utils.toDollarValue(row.amount) : 0,
                "Average Discount Per Use": row.count ? Utils.toDollarValue(row.amount/row.count) : 0,
                "Net Profit": Utils.toDollarValue(row.totalPrice - row.taxAmount - row.cogs)
            }

            reportData.push(reportObj);
        }
    } else if(args.report == "discount-product-types"){
        let data = await sequelize.query( Common.ByProductTypeQuery, queryOptions )

        for(let row of data){
            let reportObj = {
                "Discount Entity Type": row.type,
                "Discounted Entity": row.name, 
                "Uses": row.count || 0,
                "Amount Discounted": row.amount ? Utils.toDollarValue(row.amount) : 0,
                "Average Discount Per Use": row.count ? Utils.toDollarValue(row.amount/row.count) : 0,
                "Net Profit": Utils.toDollarValue(row.totalPrice - row.taxAmount - row.cogs)
            }

            reportData.push(reportObj);
        }
    }

    

    let csv = Baby.unparse(reportData);

    const date = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, `reports/${args.report}-${date}.csv`);
};
