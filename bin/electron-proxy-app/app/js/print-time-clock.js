const printer = require('printer');
const thermalPrinter = require('node-thermal-printer');
const moment = require('moment');

module.exports = async function(args){

    let {
        printerObj,
        buffer
    } = args;


    console.log(buffer);

    printer.printDirect({
        data: buffer,
        printer: printerObj.name,
        type: 'RAW',
        success: function (jobId) {
            console.log(`Printing with job id ${jobId}`);
        },
        error: function (err) {
            console.log('Error printing');
            console.error(err);
        }
    })

}