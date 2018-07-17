const { TimeClock } = alias.require('@models');

module.exports = async function(userId){

    let timeClock = await TimeClock.findOne({
        where: {
            userId: userId,
            clockOut: null
        },
        order: [
            ['clockIn', 'DESC']
        ]
    });

    if(timeClock){
        return timeClock.id;
    }else{
        return null;
    }

}
