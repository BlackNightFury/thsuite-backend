require('../init');

const config = require('../config');
const moment = require('moment-timezone');
const { Visitor, Store } = alias.require('@models');

module.exports = async () => {

    const visitors = await Visitor.findAll({
        where: {
            clockOut: null
        }
    });

    // TODO: visitor should be tied to the store?
    const store = await Store.findOne();

    for (const visitor of visitors) {
        if (moment().tz(store.timeZone).format('HH') == '00' && config.environment.visitorAutoClockOut) {

            if (!visitor.clockOut) {

                visitor.clockOut = moment().utc().format();
                visitor.autoClockedOut = true;

                console.log(`
                    Auto clocking-out ${visitor.firstName} ${visitor.lastName}:
                    Clock in ${visitor.clockIn}; Clockout ${visitor.clockOut};
                `);

                await visitor.save();
            }
        }
    };
};

if (require.main == module) {
    module.exports();
}
