
const path = require('path');

const printer = require('printer');
const thermalPrinter = require('node-thermal-printer');


console.log(printer.getPrinters());


let selectedPrinter = printer.getPrinters().find(printer => printer.name == 'POS-80');

console.log(selectedPrinter);

if(!selectedPrinter) {
    console.log("Could not find printer");
    process.exit();
}


thermalPrinter.init({
    type: 'epson'
});

(async function() {


    thermalPrinter.alignCenter();
    // await new Promise(resolve => thermalPrinter.printImage(path.join(__dirname, './youtube-5-xxl-center.png'), resolve));
    thermalPrinter.println('Colorado Grow Company');
    thermalPrinter.println('965 1/2 Main Ave');
    thermalPrinter.println('Durango, CO 81301');
    thermalPrinter.alignLeft();

    thermalPrinter.tableCustom([
        {text: `Ticket #T-72031`, width: 0.5, align: 'LEFT'},
        {text: `User: ZACKZ`, width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: `Station:CG001`, width: 0.5, align: 'LEFT'},
        {text: 'Sales Rep   RCS', width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: `10/18/2017 9:24:47 AM`, align: 'LEFT'},
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
        {text: '10.00', width: 0.17, align: 'RIGHT'},
        {text: '10.00', width: 0.17, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: ' Pre Roll UK Cheese', width: 0.45, align: 'LEFT'},
    ]);
    thermalPrinter.tableCustom([
        {text: ' Discount(20% LIN', width: 0.5, align: 'LEFT'},
        {text: '-2.00', width: 0.5, align: 'RIGHT'}
    ]);

    thermalPrinter.newLine();


    thermalPrinter.tableCustom([
        {text: 'I-001438', width: 0.45, align: 'LEFT'},
        {text: '1', width: 0.16, align: 'RIGHT'},
        {text: '10.00', width: 0.17, align: 'RIGHT'},
        {text: '10.00', width: 0.17, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: ' Pre Roll SkunkBerry', width: 0.5, align: 'LEFT'},
    ]);
    thermalPrinter.tableCustom([
        {text: ' Discount(20% LIN', width: 0.5, align: 'LEFT'},
        {text: '-2.00', align: 'RIGHT'}
    ]);

    thermalPrinter.newLine();

    thermalPrinter.tableCustom([
        {text: '----------', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Subtotal', width: 0.5, align: 'LEFT'},
        {text: '16.00', width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: '----------', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Total', width: 0.5, align: 'LEFT'},
        {text: '16.00', width: 0.5, align: 'RIGHT'}
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
        {text: '20.00', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Change (CASH)', align: 'LEFT'},
        {text: '-4.00', align: 'RIGHT'}
    ]);


    thermalPrinter.println('--------------------');

    thermalPrinter.newLine();

    thermalPrinter.println('Number of items purchased:2');
    thermalPrinter.bold(true);
    thermalPrinter.println('Total Savings:4.00');
    thermalPrinter.bold(false);

    thermalPrinter.printBarcode('701391391842', 69, {
        hriPos: 2
    });

    thermalPrinter.cut();


    let buffer = thermalPrinter.getBuffer();


    console.log(buffer);


    printer.printDirect({
        data: buffer,
        type: 'RAW',
        success: function (jobId) {
            console.log(`Printing with job id ${jobId}`);
        },
        error: function (err) {
            console.log('Error printing');
            console.error(err);
        }
    })




})();