const printer = require('printer');
const thermalPrinter = require('node-thermal-printer');
const moment = require('moment');
const formatCurrency = require('format-currency');

const currencyOpts = { format: '%s%v', code: 'USD', symbol: '$' };

module.exports = async function(data){
    let printerObj = data.printer;


    let {
        receipt,
        user,
        posDevice,
        subtotal,
        total,
        paid
    } = data;

    // for(let lineItem of receipt.LineItems){
    //     console.log(lineItem);
    //     console.log(lineItem.ProductVariation);
    //     for(let item of lineItem.ProductVariation.ProductVariationItems){
    //         console.log(item);
    //     }
    // }

    let selectedPrinter = printer.getPrinters().find(printer => printer.name === printerObj.name);

    thermalPrinter.init({
        type: 'epson'
    });

    thermalPrinter.clear()

    thermalPrinter.alignCenter();
    // await new Promise(resolve => thermalPrinter.printImage(path.join(__dirname, './youtube-5-xxl-center.png'), resolve));
    thermalPrinter.println('Colorado Grow Company');
    thermalPrinter.println('965 1/2 Main Ave');
    thermalPrinter.println('Durango, CO 81301');
    thermalPrinter.alignLeft();

    //Max length is 9 with a space so first can't be longer than 7
    let userFirst;
    if(user.firstName.length >= 8){
        userFirst = user.firstName.slice(0,7);
    }else{
        userFirst = user.firstName;
    }
    let userName = (userFirst + ' ' + user.lastName).slice(0,9);

    thermalPrinter.tableCustom([
        {text: `Ticket ${receipt.barcode}`, width: 0.5, align: 'LEFT'},
        {text: `User: ${userName}`, width: 0.5, align: 'RIGHT'}
    ]);

    //Device name max length is 15
    let deviceName = posDevice.name.slice(0,15);

    thermalPrinter.tableCustom([
        {text: `Station: ${deviceName}`, width: 0.5, align: 'LEFT'},
        {text: 'Sales Rep   RCS', width: 0.5, align: 'RIGHT'}
    ]);
    //10/18/2017 9:24:47 AM
    thermalPrinter.tableCustom([
        {text: `${moment().format('MM/DD/YYYY hh:mm:ss A')}`, align: 'LEFT'},
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

    for(let lineItem of receipt.LineItems) {
        let barcodeLine; //Max length is 18
        let productName = lineItem.Product.name;
        if(lineItem.Barcode){
            //Product line is whatever fits before barcode length + 2 ()
            let productLine = productName.slice(0, (18 - lineItem.Barcode.barcode.length - 2));
            barcodeLine = productLine + '(' + lineItem.Barcode.barcode + ')';
        }else{
            barcodeLine = productName.slice(0, 18);
        }

        thermalPrinter.tableCustom([
            {text: `${barcodeLine}`, width: 0.45, align: 'LEFT'},
            {text: `${lineItem.quantity}`, width: 0.16, align: 'RIGHT'},
            {text: `${formatCurrency(lineItem.price / lineItem.quantity, currencyOpts)}`, width: 0.17, align: 'RIGHT'},
            {text: `${formatCurrency(lineItem.price, currencyOpts)}`, width: 0.17, align: 'RIGHT'}
        ]);
        for(let item of lineItem.ProductVariation.ProductVariationItems){
            //Max length is 20 characters - 1 space before name and one between variation and product name so length is 18
            let variationName = item.quantity + item.Item.UnitOfMeasureAbbreviation;
            let variationNameLength = variationName.length;
            let maxProductNameLength = 18 - variationNameLength;
            let productName = item.Item.name.slice(0, maxProductNameLength);

            thermalPrinter.tableCustom([
                {text: ` ${productName} ${variationName}`, width: 0.45, align: 'LEFT'},
            ]);
        }

        if(lineItem.Discount) {

            let amountLine;
            if(lineItem.Discount.amountType === 'dollar'){
                amountLine = '$' + lineItem.Discount.amount;
            }else if(lineItem.Discount.amountType === 'percent'){
                amountLine = lineItem.Discount.amount + '%'
            }
            //Discount pre text is 10 characters, max 10 remaining
            let discountLine = (amountLine + ' ' + lineItem.Discount.name).slice(0, 10);

            thermalPrinter.tableCustom([
                {text: ` Discount(${discountLine}`, width: 0.5, align: 'LEFT'},
                {text: `-${formatCurrency(lineItem.discountAmount, currencyOpts)}`, width: 0.5, align: 'RIGHT'}
            ]);
        }

        thermalPrinter.newLine();
    }

    let numPurchased = 0;
    let totalSavings = 0;
    for(let lineItem of receipt.LineItems){
        numPurchased += lineItem.quantity;
        totalSavings += lineItem.discountAmount;
    }

    thermalPrinter.newLine();

    thermalPrinter.tableCustom([
        {text: '----------', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Subtotal', width: 0.5, align: 'LEFT'},
        {text: `${formatCurrency(total - totalSavings, currencyOpts)}`, width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: '----------', align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Total', width: 0.5, align: 'LEFT'},
        {text: `${formatCurrency(total - totalSavings, currencyOpts)}`, width: 0.5, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: '==========', align: 'RIGHT'}
    ]);

    thermalPrinter.newLine();
    thermalPrinter.newLine();
    thermalPrinter.newLine();

    thermalPrinter.println('Tender:');
    thermalPrinter.tableCustom([
        {text: `${receipt.paymentMethod.toUpperCase()}`, align: 'LEFT'},
        {text: `${formatCurrency(paid, currencyOpts)}`, align: 'RIGHT'}
    ]);
    thermalPrinter.tableCustom([
        {text: 'Change (CASH)', align: 'LEFT'},
        {text: `${formatCurrency(total - totalSavings - paid, currencyOpts)}`, align: 'RIGHT'}
    ]);


    thermalPrinter.println('--------------------');

    thermalPrinter.newLine();


    thermalPrinter.println(`Number of items purchased:${numPurchased}`);
    thermalPrinter.bold(true);
    thermalPrinter.println(`Total Savings:${formatCurrency(totalSavings, currencyOpts)}`);
    thermalPrinter.bold(false);

    thermalPrinter.alignCenter();
    thermalPrinter.printBarcode(receipt.barcode, 69, {
        hriPos: 2
    });

    thermalPrinter.cut();


    let buffer = thermalPrinter.getBuffer();


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
