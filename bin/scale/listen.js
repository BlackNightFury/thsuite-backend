const SerialPort = require('serialport');

module.exports = async function(args){
    //Emit to socket on port data

    let deviceId = args.deviceId;
    let portName = args.port;
    let socket = args.socket;

    let port = new SerialPort(portName, (err) => {
        if(err){
            return console.log("Error opening port: ", err.message);
        }
    });

    port.on('data', (data) => {
        let valueBuf = data.slice(7, 15);
        let weight = parseFloat(valueBuf.toString('ascii').trim());
        console.log("Got data", weight);
        socket.emit('scaleData', {deviceId, weight});
    });

}
