const thermalPrinter = require('node-thermal-printer');
const printer = require('printer');
module.exports = async function(printerObj){

    thermalPrinter.init({
        type: 'epson'
    });

    thermalPrinter.clear();

    thermalPrinter.openCashDrawer();

    let buffer = thermalPrinter.getBuffer();

    await new Promise((resolve, reject) => {
        printer.printDirect({
            data: buffer,
            printer: printerObj.name,
            type: 'RAW',
            success: function (jobId) {
                console.log(`Opening drawer ${jobId}`);
                resolve();
            },
            error: function (err) {
                console.log('Error opening drawer');
                console.error(err);
                reject();
            }
        });
    });

}
