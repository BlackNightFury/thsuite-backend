const { Printer } = alias.require('@models');

const ProxySocketCache = require('./proxy-socket-cache');

module.exports = async function(printerId){

    let printerObj = await Printer.findOne({
        where: {
            id: printerId
        }
    });

    if(printerObj) {

        let sockets = ProxySocketCache.get(printerObj.deviceProxyId);

        let connected = sockets.filter(socket => socket.connected);

        if(connected.length == 0){
            console.log("NO CONNECTED SOCKETS");
            ProxySocketCache.showCaches();
        }else {
            if (connected.length >= 2) {
                console.log("MULTIPLE CONNECTED SOCKETS");
                console.log(connected);
            }

            printerObj = printerObj.get({plain: true});

            for(let socket of connected){
                socket.emit('openDrawer', printerObj);
            }
        }

    }

}
