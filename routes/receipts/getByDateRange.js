const {Receipt} = alias.require('@models');
const moment = require('moment');

module.exports = async function(data){

    let dateRange = data.dateRange;
    let filters = data.filters;

    let receiptWhere = {
        createdAt: {
            $between: [
                moment.utc(dateRange.startDate).toDate(),
                moment.utc(dateRange.endDate).toDate()
            ]
        }
    };

    if(filters.paymentMethod && filters.paymentMethod !== 'all'){
        receiptWhere.paymentMethod = filters.paymentMethod;
    }


    let receipts = await Receipt.findAll({
        attributes: ['id'],
        where: receiptWhere,
        order: [['createdAt', 'desc']]
    });

    return receipts.map(r => r.id);

};