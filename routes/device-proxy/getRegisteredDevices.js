const {DeviceProxy, Printer, Scale} = alias.require('@models');

module.exports = async function(args){

    let type = args.type;
    let proxyId = args.proxyId;

    let Device;
    if(type === 'printer'){
        Device = Printer;
    }else if(type === 'scale'){
        Device = Scale;
    }

    let devices = await Device.findAll({
        where:{
            deviceProxyId: proxyId,
            isEnabled: true
        }
    });

    return devices;

}
