const printer = require('printer');
const thermalPrinter = require('node-thermal-printer');
const moment = require('moment');
const formatCurrency = require('format-currency');
const path = require('path');

const currencyOpts = { format: '%s%v', code: 'USD', symbol: '$' };

module.exports = async function(data){

    let {
        printerObj,
        buffer
    } = data;

    console.log(buffer);

    await new Promise((resolve, reject) => {
        printer.printDirect({
            data: buffer,
            printer: printerObj.name,
            type: 'RAW',
            success: function (jobId) {
                console.log(`Printing with job id ${jobId}`);
                resolve();
            },
            error: function (err) {
                console.log('Error printing');
                console.error(err);
                reject();
            }
        });
    });


}
