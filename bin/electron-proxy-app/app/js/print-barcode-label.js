const printer = require('printer');

module.exports = async function(data){

    let {
        printerObj,
        buffer
    } = data;


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
    });




}

