const printer = require('printer');
const thermalPrinter = require('node-thermal-printer');
const moment = require('moment');
const formatCurrency = require('format-currency');
const path = require('path');

const currencyOpts = { format: '%s%v', code: 'USD', symbol: '$' };

module.exports = async function(printerObj){

    thermalPrinter.init({
        type: 'epson',
        width: 56
    });

    thermalPrinter.clear();

    thermalPrinter.alignCenter();
    thermalPrinter.println('COMPANY NAME HERE');
    thermalPrinter.println('STORE ADDRESS');
    thermalPrinter.println('STORE ADDRESS LINE 2');
    thermalPrinter.alignLeft();

    thermalPrinter.tableCustom([
        {text: `Ticket TEST RECEIPT`, width: 0.5, align: 'LEFT'},
        {text: `User: TEST`, width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: `Station:TEST TEST`, width: 0.5, align: 'LEFT'},
        {text: 'Sales Rep   RCS', width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: moment().format("MM/DD/YYYY hh:mm a"), align: 'LEFT'},
    ]);

    thermalPrinter.drawLine();

    thermalPrinter.tableCustom([
        {text: 'Item', width: 0.45, align: 'LEFT'},
        {text: 'Qty', width: 0.16, align: 'RIGHT'},
        {text: 'Price', width: 0.17, align: 'RIGHT'},
        {text: 'Total', width: 0.17, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: ' Description', align: 'LEFT'}
    ]);

    thermalPrinter.drawLine();


    thermalPrinter.tableCustom([
        {text: 'I-001204', width: 0.45, align: 'LEFT'},
        {text: '1', width: 0.16, align: 'RIGHT'},
        {text: '$10.00', width: 0.17, align: 'RIGHT'},
        {text: '$10.00', width: 0.17, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: ' TEST TEST TEST', width: 0.45, align: 'LEFT'},
    ]);
    thermalPrinter.tableCustom([
        {text: ' Discount(20% TEST', width: 0.5, align: 'LEFT'},
        {text: '-$2.00', width: 0.5, align: 'RIGHT'}
    ]);

    thermalPrinter.newLine();


    thermalPrinter.tableCustom([
        {text: 'I-001438', width: 0.45, align: 'LEFT'},
        {text: '1', width: 0.16, align: 'RIGHT'},
        {text: '$10.00', width: 0.17, align: 'RIGHT'},
        {text: '$10.00', width: 0.17, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: ' TEST TEST TEST', width: 0.5, align: 'LEFT'},
    ]);
    thermalPrinter.tableCustom([
        {text: ' Discount(20% TEST', width: 0.5, align: 'LEFT'},
        {text: '-$2.00', align: 'RIGHT'}
    ]);

    thermalPrinter.newLine();

    thermalPrinter.tableCustom([
        {text: '----------', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Subtotal', width: 0.5, align: 'LEFT'},
        {text: '$16.00', width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: '----------', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Total', width: 0.5, align: 'LEFT'},
        {text: '$16.00', width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: '==========', align: 'RIGHT'}
    ]);

    thermalPrinter.newLine();
    thermalPrinter.newLine();
    thermalPrinter.newLine();

    thermalPrinter.println('Tender:');
    thermalPrinter.tableCustom([
        {text: 'CASH', align: 'LEFT'},
        {text: '$20.00', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Change (CASH)', align: 'LEFT'},
        {text: '-$4.00', align: 'RIGHT'}
    ]);


    thermalPrinter.println('--------------------');

    thermalPrinter.newLine();

    thermalPrinter.println('Number of items purchased:2');
    thermalPrinter.bold(true);
    thermalPrinter.println('Total Savings:4.00');
    thermalPrinter.bold(false);

    let receiptBarcode = 'TEST TEST';

    thermalPrinter.printBarcode(receiptBarcode, 69, {
        hriPos: 2
    });

    thermalPrinter.cut();


    let buffer = thermalPrinter.getBuffer();


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
