const { Discount, sequelize } = alias.require('@models');
const moment = require('moment');
const Common = require('./common')

module.exports = async function(args){

    const queryOptions = {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate: args.startDate,
            endDate: args.endDate
        }
    }

    let [ productTypeDiscounts, productDiscounts, packageDiscounts, noneDiscounts ] = await Promise.all( [
        sequelize.query( Common.ByProductTypeQuery, queryOptions ),
        sequelize.query( Common.ByProductQuery, queryOptions ),
        sequelize.query( Common.ByPackageQuery, queryOptions ),
        sequelize.query( Common.ByNoneQuery, queryOptions )
    ] )

    let data = productTypeDiscounts.concat(productDiscounts, packageDiscounts, noneDiscounts)

    Common.addTotal(data)

    return data;
}
