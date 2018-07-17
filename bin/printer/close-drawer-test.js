const printer = require('printer');
const thermalPrinter = require('node-thermal-printer');
const moment = require('moment');
const formatCurrency = require('format-currency');

const path = require('path');

const currencyOpts = { format: '%s%v', code: 'USD', symbol: '$' };

const config = require('../../config');

(async function(){

    thermalPrinter.init({
        type: 'epson'
    });

    thermalPrinter.clear();

    thermalPrinter.alignCenter();

    let logoPath = config.environment.logoImageLocation;

    await new Promise(resolve => thermalPrinter.printImage(path.join(__dirname, logoPath), resolve));
    thermalPrinter.bold(true);
    thermalPrinter.println("Karing Kind LLC");
    thermalPrinter.println("Sales Report - 12/1/17 to 12/1/17")
    thermalPrinter.bold(false);
    thermalPrinter.println("Location: Karing Kind");
    thermalPrinter.println("Salesperson: Garrett Roach");

    thermalPrinter.bold(true);
    thermalPrinter.println("Sales Breakdown Report");
    thermalPrinter.println("12/1/17 to 12/1/17");

    thermalPrinter.tableCustom([
        {text: 'Type', width: 0.38, align: 'LEFT'},
        {text: 'Count', width: 0.16, align: 'RIGHT'},
        {text: 'Value', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(false);

    thermalPrinter.tableCustom([
        {text: 'Total with Taxes', width: 0.38, align: 'LEFT'},
        {text: '157', width: 0.16, align: 'RIGHT'},
        {text: '$1,983.18', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'Total Taxes', width: 0.38, align: 'LEFT'},
        {text: '', width: 0.16, align: 'RIGHT'},
        {text: '$135.57', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'Total W/O Taxes', width: 0.38, align: 'LEFT'},
        {text: '', width: 0.16, align: 'RIGHT'},
        {text: '$1,847.61', width: 0.25, align: 'RIGHT'},
    ]);


    thermalPrinter.bold(true);
    thermalPrinter.println("MJ Item Category Breakdowns");

    thermalPrinter.tableCustom([
        {text: 'Type', width: 0.38, align: 'LEFT'},
        {text: 'Count', width: 0.16, align: 'RIGHT'},
        {text: 'Value', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(false);

    thermalPrinter.tableCustom([
        {text: 'Buds', width: 0.38, align: 'LEFT'},
        {text: '36', width: 0.16, align: 'RIGHT'},
        {text: '$783.18', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'Shake/Trim', width: 0.38, align: 'LEFT'},
        {text: '28', width: 0.16, align: 'RIGHT'},
        {text: '$554.92', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'Infused (edible)', width: 0.38, align: 'LEFT'},
        {text: '21', width: 0.16, align: 'RIGHT'},
        {text: '$326.73', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'Concentrate (Each)', width: 0.38, align: 'LEFT'},
        {text: '18', width: 0.16, align: 'RIGHT'},
        {text: '$288.35', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(true);
    thermalPrinter.println("Tax Category Breakdowns");

    thermalPrinter.tableCustom([
        {text: 'Type', width: 0.38, align: 'LEFT'},
        {text: 'Count', width: 0.16, align: 'RIGHT'},
        {text: 'Value', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(false);

    thermalPrinter.tableCustom([
        {text: 'cannabis', width: 0.38, align: 'LEFT'},
        {text: '120', width: 0.16, align: 'RIGHT'},
        {text: '$683.18', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'non-cannabis', width: 0.38, align: 'LEFT'},
        {text: '1', width: 0.16, align: 'RIGHT'},
        {text: '$14.92', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(true);
    thermalPrinter.println("Tax Type Breakdowns");

    thermalPrinter.tableCustom([
        {text: 'Type', width: 0.38, align: 'LEFT'},
        {text: 'Count', width: 0.16, align: 'RIGHT'},
        {text: 'Value', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(false);

    thermalPrinter.tableCustom([
        {text: 'County of Boulder Tax', width: 0.38, align: 'LEFT'},
        {text: '120', width: 0.16, align: 'RIGHT'},
        {text: '$10,313.18', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'State Cannabis Tax', width: 0.38, align: 'LEFT'},
        {text: '118', width: 0.16, align: 'RIGHT'},
        {text: '$145.73', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(true);
    thermalPrinter.println("Payment Type Breakdown");

    thermalPrinter.tableCustom([
        {text: 'Type', width: 0.38, align: 'LEFT'},
        {text: 'Count', width: 0.16, align: 'RIGHT'},
        {text: 'Value', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.bold(false);

    thermalPrinter.tableCustom([
        {text: 'Cash', width: 0.38, align: 'LEFT'},
        {text: '100', width: 0.16, align: 'RIGHT'},
        {text: '$1,313.18', width: 0.25, align: 'RIGHT'},
    ]);

    thermalPrinter.tableCustom([
        {text: 'Gift Card', width: 0.38, align: 'LEFT'},
        {text: '57', width: 0.16, align: 'RIGHT'},
        {text: '$645.73', width: 0.25, align: 'RIGHT'},
    ]);


    thermalPrinter.cut();


    let buffer = thermalPrinter.getBuffer();


    await new Promise((resolve, reject) => {
        printer.printDirect({
            data: buffer,
            printer: "EPSON TM-T88V Receipt",
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


})();

