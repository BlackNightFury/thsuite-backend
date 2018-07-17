const { TimeClock } = alias.require('@models');
const moment = require('moment');

module.exports = async function(data){

    let userId = data.userId;

    let where = {
        userId: userId
    };

    if(data.dateRange){
        let dateRange = data.dateRange;

        where.clockIn = {
            $between: [
                moment.utc(dateRange.startDate).toDate(),
                moment.utc(dateRange.endDate).toDate()
            ]
        };
    }
    let timeClocks = await TimeClock.findAll({
        where: where,
        order: [
            ['clockIn', 'DESC']
        ]
    });

    return timeClocks.map(t => {return t.id});
}
