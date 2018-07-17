const printer = require('printer');
const fs = require('fs');
const path = require('path');
const serialport = require('serialport');

(async function(){

    // let bufferArray = [];

    // let start = `1B 40
    //              `;

    // let bufferString = `1B 40
    //                     1B 69 42 0D 00
    //                     05
    //                     02
    //                     00
    //                     7D 00
    //                     03
    //                     31 32 41 42 24 25 2E
    //                     0C`;

    let bufferString = `1B 40
                        1B 69 42
                        31 32 41 42 24 25 2E
                        5C
                        0D
                        0C`;

    // let bufferString = `1B 69 61 00
    //                     1B 40
    //                     74 65 73 74
    //                     0C`;

    // let clearBuffer = `00`.repeat(100);
    //
    // let initialize = `1B 40`;
    //
    // let statusInfoRequest = `1B 69 53`;
    //
    // let bufferString = initialize + statusInfoRequest;

    bufferString = bufferString.replace(/\s/g, '');

    let buffer = Buffer.from(bufferString, 'hex');

    console.log(buffer);

    let port = new serialport('COM3', {baudRate: 115200}, (err) => {
        if(err){
            return console.log("Error opening port: ", err.message);
        }
    });

    port.on('data', (data) => {
        console.log("Serial port produced data: ");
        console.log(data);
    });

    port.on('error', (err) => {
        console.log("Serial port produced error: ");
        console.log(err);
    });

    port.write(buffer, (err) => {
        if(err){
            console.log("Error on write");
            console.log(err);
        }
    });
    port.drain((err) => {
        if(err){
            console.log("Error on drain");
            console.log(err);
        }else{
            console.log("Drain callback");
        }
    });

    setTimeout(() => {}, 10000);
    //
    // let buffer = Buffer.from(bufferString, 'hex');
    //
    // printer.printDirect({
    //     data: buffer,
    //     printer: 'Brother QL-650TD',
    //     type: 'RAW',
    //     success: function (jobId) {
    //         console.log(`Printing with job id ${jobId}`);
    //     },
    //     error: function (err) {
    //         console.log('Error printing');
    //         console.error(err);
    //     }
    // })

})();
