
const SerialPort = require('serialport');

module.exports = class ScaleListener{
    port;
    portName;
    deviceId;
    socket;

    open(args){
        this.portName = args.port;
        this.deviceId = args.deviceId;
        this.socket = args.socket;

        let promise =  new Promise((resolve, reject) => {
            this.port = new SerialPort(this.portName, (err) => {
                if(err){
                    console.log("Error opening port: ", err.message);
                    reject(err);
                }else{
                    resolve();
                }
            });
        });



        this.port.on('data', (data) => {
            let valueBuf = data.slice(7, 15);
            let weight = parseFloat(valueBuf.toString('ascii').trim());
            console.log("Got data", weight);
            let deviceId = this.deviceId;
            this.socket.emit('scaleData', {deviceId, weight}, () => {});
        });

        return promise;
    }

    close(){
        if(this.port.isOpen){
            this.port.close();
        }
    }
}

