require('../init');

const config = require('../config');
const moment = require('moment-timezone');
const { User, TimeClock, Store } = alias.require('@models');

module.exports = async () => {

    const users = await User.findAll({
        include: [ Store ],
        where: {
            isActive: true
        }
    });

    for (const user of users) {
        if (moment().tz(user.Store.timeZone).format('HH') == '00' && config.environment.autoClockOut) {

            const timeClock = await TimeClock.findOne({
                where: {
                    userId: user.id
                },
                order: [['clockIn', 'DESC']]
            });

            if (timeClock && !timeClock.clockOut) {

                timeClock.clockOut = moment().utc().format();
                timeClock.autoClockedOut = true;

                console.log(`
                    Auto clocking-out ${user.firstName} ${user.lastName}:
                    Clock in ${timeClock.clockIn}; Clockout ${timeClock.clockOut};
                `);

                await timeClock.save();
            }
        }
    };
};

if (require.main == module) {
    module.exports();
}
