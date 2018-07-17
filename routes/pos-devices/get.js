
const { PosDevice } = alias.require('@models');


module.exports = async function(deviceId) {

    let posDevice = await PosDevice.findOne({
        where: {
            id: deviceId
        }
    });

    if(posDevice){
        return posDevice.get({plain: true})
    }else{
        return null;
    }

};
