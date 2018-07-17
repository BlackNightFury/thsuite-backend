const {DeviceProxy, Printer, Scale} = alias.require('@models');
const uuid = require('uuid');

const ProxySocketCache = require('./proxy-socket-cache');

module.exports = async function(registerOptions){

    let [deviceProxy, created] = await DeviceProxy.findOrCreate({
        where: {
            id: registerOptions.id
        },
        defaults: {
            name: registerOptions.name
        }
    });

    let registeredIds = [];

    let Device;
    if(registerOptions.type === 'printer'){
        Device = Printer;
    }else if(registerOptions.type === 'scale'){
        Device = Scale;
    }

    for(let device of registerOptions.devices){

        let [deviceObj, created] = await Device.findOrCreate({
            where: {
                deviceProxyId: deviceProxy.id,
                name: device.name,
                port: device.portName
            },
            defaults: {
                id: uuid.v4(),
                isEnabled: true
            }
        });

        if(!created){
            deviceObj.isEnabled = true;
            await deviceObj.save();
        }

        registeredIds.push(deviceObj.id);

    }

    //Remove unregisterd
    await Device.destroy({
        where: {
            id: {
                $notIn: registeredIds
            },
            deviceProxyId: deviceProxy.id
        }
    });

    ProxySocketCache.register(deviceProxy.id, this);

    console.log("OPTIONS");
    console.log(registerOptions);

    console.log("CACHE");
    ProxySocketCache.showCaches();

    this.emit('refresh');


};