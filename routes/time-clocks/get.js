
const { TimeClock } = alias.require('@models');


module.exports = async function(timeClockId) {

    let timeClock = await TimeClock.findOne({
        where: {
            id: timeClockId
        }
    });

    return timeClock.get({plain: true})
};