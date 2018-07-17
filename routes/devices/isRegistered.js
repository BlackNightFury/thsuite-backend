const { Device } = alias.require('@models');
module.exports = async function(deviceId){

    let device = await Device.findOne({
        where: {
            id: deviceId
        }
    });

    return !!device;

}