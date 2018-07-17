const { Discount, sequelize } = alias.require('@models');
const moment = require('moment');
const Common = require('./common')

module.exports = async function(args){

    let data = await sequelize.query( Common.OverallQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate: args.startDate,
            endDate: args.endDate
        }
    });

    Common.addTotal(data)
    
    return data;
}
