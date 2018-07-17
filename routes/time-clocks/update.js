const { TimeClock } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(TimeClock, function(existingTimeClock, timeClock) {

    existingTimeClock.id = timeClock.id;
    existingTimeClock.version = timeClock.version;
    existingTimeClock.userId = timeClock.userId;

    existingTimeClock.clockIn = timeClock.clockIn;
    existingTimeClock.clockOut = timeClock.clockOut;


});