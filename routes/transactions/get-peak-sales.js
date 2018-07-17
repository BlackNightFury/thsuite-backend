const {Transaction, Product, sequelize } = alias.require('@models');
const moment = require('moment');
const Common = require('./common');

module.exports = async function(args){
    return Common.handlePeakSales(args, args.timeZone)
};
