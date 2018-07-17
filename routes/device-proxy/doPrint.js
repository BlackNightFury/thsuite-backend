const { Printer, Device, Receipt, User, Patient, LineItem, Product, ProductVariation, ProductVariationItem, Item, Barcode, Discount, Transaction, TransactionTax, Tax, Store, Drawer } = alias.require('@models');
const uuid = require('uuid');

const thermalPrinter = require('node-thermal-printer');
const moment = require('moment');
const formatCurrency = require('format-currency');
const path = require('path');

const config = require('../../config');

const currencyOpts = { format: '%s%v', code: 'USD', symbol: '$' };

const ProxySocketCache = require('./proxy-socket-cache');

module.exports = async function(args){

    console.log("Got args: " + args);

    let printerId = args.printerId;
    let deviceId = args.posDeviceId;
    let storeId = args.storeId;

    let printerObj = await Printer.findOne({
        where: {
            id: printerId
        }
    });

    //Get pos device
    let device = await Device.findOne({
        where: {
            id: deviceId
        }
    });

    let store = await Store.findOne({
        where: {
            id: storeId
        }
    });

    //Get receipt with associated data
    let receipt = await Receipt.findOne({
        where: {
            id: args.receiptId
        },
        include: [
            {
                model: User
            },
            {
                model: Drawer,
                include: [
                    {
                        model: Device
                    }
                ]
            },
            {
                model: LineItem,
                include: [
                    {
                        model: Discount
                    },
                    {
                        model: Barcode
                    },
                    {
                        model: Product
                    },
                    {
                        model: Transaction,
                        include: [
                            {
                                model: TransactionTax
                            }
                        ]
                    },
                    {
                        model: ProductVariation,
                        include: [
                            {
                                model: ProductVariationItem,
                                include: [
                                    {
                                        model: Item
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    let patient = {};

    if(receipt.patientId){

        patient = await Patient.findOne({
            where: {
                id: receipt.patientId
            }
        });

    }

    let allTaxes = await Tax.findAll();

    let taxMap = {};
    for(let tax of allTaxes){
        taxMap[tax.id] = tax;
    }

    console.log(receipt);

    let sockets = ProxySocketCache.get(printerObj.deviceProxyId);

    let connected = sockets.filter(socket => socket.connected);

    if(connected.length == 0){
        console.log("NO CONNECTED SOCKETS");
        ProxySocketCache.showCaches();
    }else {
        if (connected.length >= 2) {
            console.log("MULTIPLE CONNECTED SOCKETS");
            console.log(connected);
        }

        let user = receipt.User;
        let subtotal = args.subtotal;
        let total = args.total == undefined ? 0 : args.total;
        let paid = args.paid == undefined ? 0 : args.paid;

        //Aggregate taxes
        let taxes = {};
        let totalTax = 0;

        for(let lineItem of receipt.LineItems){
            for(let transaction of lineItem.Transactions){
                for(let transactionTax of transaction.TransactionTaxes){
                    let tax = taxMap[transactionTax.taxId];
                    if(taxes[tax.name]){
                        taxes[tax.name] += transactionTax.amount;
                    }else{
                        taxes[tax.name] = transactionTax.amount;
                    }
                    totalTax += transactionTax.amount;
                }
            }
        }

        thermalPrinter.init({
            type: 'epson',
            width: 56
        });

        thermalPrinter.clear();

        thermalPrinter.openCashDrawer();

        thermalPrinter.alignCenter();

        let logoPath = config.environment.logoImageLocation;

        await new Promise(resolve => thermalPrinter.printImage(path.join(__dirname, logoPath), resolve));
        thermalPrinter.println(config.environment.addressInformation.name);
        thermalPrinter.println(config.environment.addressInformation.address1);
        thermalPrinter.println(config.environment.addressInformation.address2);
        if(config.environment.addressInformation.address3){
            thermalPrinter.println(config.environment.addressInformation.address3);
        }
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
        let deviceName = receipt.Drawer.Device.name.slice(0,15);

        thermalPrinter.tableCustom([
            {text: `Station: ${deviceName}`, width: 0.5, align: 'LEFT'},
            {text: 'Sales Rep   RCS', width: 0.5, align: 'RIGHT'}
        ]);

        if(config.environment.showPatientInfo){
            thermalPrinter.tableCustom([
                {text: `PT ID: ${patient.medicalStateId}`, width: 0.5, align: 'LEFT'},
                {text: `PT Name: ${patient.firstName} ${patient.lastName}`, width: 0.5, align: 'RIGHT'}
            ]);
        }

        thermalPrinter.tableCustom([
            {text: `${moment(receipt.createdAt).tz(store.timeZone).format('MM/DD/YYYY hh:mm:ss A')}`, align: 'LEFT'},
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
            {text: `${formatCurrency((total - (store.taxesIncluded ? 0 : totalTax)), currencyOpts)}`, width: 0.5, align: 'RIGHT'}
        ]);
        thermalPrinter.tableCustom([
            {text: '----------', align: 'RIGHT'}
        ]);

        thermalPrinter.bold(true);
        thermalPrinter.println(`Taxes Paid${store.taxesIncluded ? ' (Included)' : ''}`);
        thermalPrinter.bold(false);

        for(let taxName of Object.keys(taxes).sort()){
            let amount = taxes[taxName];
            thermalPrinter.tableCustom([
                {text: `${taxName}`, width: 0.5, align: 'LEFT'},
                {text: `${formatCurrency(amount, currencyOpts)}`, width: 0.5, align: 'RIGHT'}
            ]);
        }

        thermalPrinter.tableCustom([
            {text: '----------', align: 'RIGHT'}
        ]);

        thermalPrinter.tableCustom([
            {text: 'Total', width: 0.5, align: 'LEFT'},
            {text: `${formatCurrency(total, currencyOpts)}`, width: 0.5, align: 'RIGHT'}
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
            {text: `${formatCurrency(total - paid, currencyOpts)}`, align: 'RIGHT'}
        ]);


        // thermalPrinter.println('--------------------');

        // thermalPrinter.newLine();
        //
        // thermalPrinter.bold(true);
        // thermalPrinter.println(`Taxes Paid`);
        // thermalPrinter.bold(false);
        //
        // for(let taxName of Object.keys(taxes).sort()){
        //     let amount = taxes[taxName];
        //     thermalPrinter.tableCustom([
        //         {text: `${taxName}`, width: 0.5, align: 'LEFT'},
        //         {text: `${formatCurrency(amount, currencyOpts)}`, width: 0.5, align: 'RIGHT'}
        //     ]);
        // }

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

        if(config.environment.bottomStaticInfo.lines.length){

            thermalPrinter.alignCenter();
            for(let line of config.environment.bottomStaticInfo.lines){
                if(line == "NEWLINE"){
                    thermalPrinter.newLine();
                }else{
                    thermalPrinter.println(line)
                }
            }

        }

        thermalPrinter.cut();

        let buffer = thermalPrinter.getBuffer();

        printerObj = printerObj.get({plain: true});

        for(let socket of connected){
            socket.emit('doPrint', {printerObj, buffer});
        }
    }

};