const { sequelize } = alias.require('@models');
const moment = require('moment');
const Common = require('./common')

module.exports = async function(args) {
    return Common.getDailySales(args)
};
