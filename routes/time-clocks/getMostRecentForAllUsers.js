const { User, TimeClock } = alias.require('@models');

module.exports = async function(){

    let users = await User.findAll({
        where: {
            isActive: true
        }
    });

    let userIds = users.map((user) => user.id);

    let timeClocks = {};

    for(let userId of userIds){
        let timeClock = await TimeClock.findOne({
            where: {
                userId: userId
            },
            order: [['clockIn', 'DESC']]
        });

        if(timeClock){
            timeClocks[userId] = timeClock;
        }else{
            timeClocks[userId] = null;
        }
    }

    return timeClocks;

};