const SerialPort = require('serialport');

(async function(){

    let port = new SerialPort('COM3', (err) => {
        if(err){
            return console.log("Error opening port: ", err.message);
        }
    });

    port.on('error', (err) => {
        console.log("Error: ",err);
    });

    port.on('data', (data) => {
        let valueBuf = data.slice(7, 15);
        let weight = parseFloat(valueBuf.toString('ascii').trim());
        console.log("Weight: ", weight);
    });

    setInterval(()=>{}, 10000);


})();
