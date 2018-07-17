const {DeviceProxy, Printer, Scale} = alias.require('@models');

const ProxySocketCache = require('./proxy-socket-cache');

module.exports = async function(){

    let deviceProxyId = ProxySocketCache.getDeviceProxyId(this.id);

    await Printer.update({
        isEnabled: 0
    }, {
        where: {
            deviceProxyId: deviceProxyId
        }
    });

    await Scale.update({
        isEnabled: 0
    }, {
        where: {
            deviceProxyId: deviceProxyId
        }
    });

    ProxySocketCache.unregister(this.id);

    this.broadcast.emit('remove');

}