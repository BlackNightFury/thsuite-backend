const moment = require('moment');
require('moment-timezone');
const thermalPrinter = require('node-thermal-printer');
const {Store, Printer, Device, TimeClock, User} = alias.require('@models');

const formatCurrency = require('format-currency');

const path = require('path');

const currencyOpts = { format: '%s%v', code: 'USD', symbol: '$' };

const config = require('../../config');

const ProxySocketCache = require('./proxy-socket-cache');
const drawerClosingReport = require('../drawers/drawer-closing-report');

module.exports = async function(args){

    //TODO: Fix for multi store implementation
    let store = await Store.findOne();

    console.log(args);

    let printerId = args.printerId;
    let deviceId = args.deviceId;

    let printerObj = await Printer.findOne({
        where: {
            id: printerId
        }
    });

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

        let userId = args.userId;

        let user = await User.findOne({
            where: {
                id: userId
            }
        });

        let selectedDate = args.selectedDate;

        let reportData = await drawerClosingReport({userId, deviceId, selectedDate});

        let reportMode = userId ? 'user' : (deviceId ? 'device' : 'store');

        let reportDataArray;

        if(reportMode == 'user' || reportMode == 'device'){
            reportDataArray = reportData.drawerAggregates;
        }else if(reportMode == 'store'){
            reportDataArray = [reportData.allDrawers];
        }

        // reportData = userId ? reportData.drawerAggregates[0] : reportData.allDrawers;

        thermalPrinter.init({
            type: 'epson'
        });

        thermalPrinter.clear();

        //Start loop
        for(let reportData of reportDataArray) {

            thermalPrinter.alignCenter();

            let logoPath = config.environment.logoImageLocation;

            await new Promise(resolve => thermalPrinter.printImage(path.join(__dirname, logoPath), resolve));
            thermalPrinter.bold(true);
            thermalPrinter.println(config.environment.companyName);
            thermalPrinter.println("Sales Report - " + selectedDate);
            thermalPrinter.bold(false);
            thermalPrinter.println("Location: " + config.environment.addressInformation.name);

            thermalPrinter.println(`Salesperson: ${reportData.userName}`);

            //Drawer open time
            if(reportData.openedAt){
                thermalPrinter.println(`Drawer Opened: ${moment.utc(reportData.openedAt).tz(store.timeZone).format("M/D/YYYY, h:mm A")}`)
            }

            thermalPrinter.bold(true);
            thermalPrinter.println("Sales Breakdown Report");
            thermalPrinter.println(selectedDate);

            thermalPrinter.tableCustom([
                {text: 'Type', width: 0.38, align: 'LEFT'},
                {text: 'Count', width: 0.16, align: 'RIGHT'},
                {text: 'Value', width: 0.25, align: 'RIGHT'},
            ]);

            thermalPrinter.bold(false);

            thermalPrinter.tableCustom([
                {text: 'Total with Taxes', width: 0.38, align: 'LEFT'},
                {text: `${reportData.count}`, width: 0.16, align: 'RIGHT'},
                {text: formatCurrency(reportData.total, currencyOpts), width: 0.25, align: 'RIGHT'},
            ]);

            thermalPrinter.tableCustom([
                {text: 'Total Taxes', width: 0.38, align: 'LEFT'},
                {text: '', width: 0.16, align: 'RIGHT'},
                {text: formatCurrency(reportData.totalTaxes, currencyOpts), width: 0.25, align: 'RIGHT'},
            ]);

            thermalPrinter.tableCustom([
                {text: 'Total W/O Taxes', width: 0.38, align: 'LEFT'},
                {text: '', width: 0.16, align: 'RIGHT'},
                {text: formatCurrency(reportData.totalWithoutTaxes, currencyOpts), width: 0.25, align: 'RIGHT'},
            ]);


            thermalPrinter.bold(true);
            thermalPrinter.println("MJ Item Category Breakdowns");

            thermalPrinter.tableCustom([
                {text: 'Type', width: 0.38, align: 'LEFT'},
                {text: 'Count', width: 0.16, align: 'RIGHT'},
                {text: 'Value', width: 0.25, align: 'RIGHT'},
            ]);

            thermalPrinter.bold(false);

            for (let category of reportData.totalByProductType) {

                thermalPrinter.tableCustom([
                    {text: category.name, width: 0.38, align: 'LEFT'},
                    {text: category.total.count, width: 0.16, align: 'RIGHT'},
                    {text: formatCurrency(category.total.amount, currencyOpts), width: 0.25, align: 'RIGHT'},
                ]);

            }


            thermalPrinter.bold(true);
            thermalPrinter.println("Tax Category Breakdowns");

            thermalPrinter.tableCustom([
                {text: 'Type', width: 0.38, align: 'LEFT'},
                {text: 'Count', width: 0.16, align: 'RIGHT'},
                {text: 'Value', width: 0.25, align: 'RIGHT'},
            ]);

            thermalPrinter.bold(false);

            for (let category of reportData.totalByCannabisType) {

                thermalPrinter.tableCustom([
                    {text: category.name, width: 0.38, align: 'LEFT'},
                    {text: category.total.count, width: 0.16, align: 'RIGHT'},
                    {text: formatCurrency(category.total.amount, currencyOpts), width: 0.25, align: 'RIGHT'},
                ]);

            }


            thermalPrinter.bold(true);
            thermalPrinter.println("Tax Type Breakdowns");

            thermalPrinter.tableCustom([
                {text: 'Type', width: 0.38, align: 'LEFT'},
                {text: 'Count', width: 0.16, align: 'RIGHT'},
                {text: 'Value', width: 0.25, align: 'RIGHT'},
            ]);

            thermalPrinter.bold(false);

            for (let category of reportData.totalByTax) {

                thermalPrinter.tableCustom([
                    {text: category.name, width: 0.38, align: 'LEFT'},
                    {text: category.total.count, width: 0.16, align: 'RIGHT'},
                    {text: formatCurrency(category.total.amount, currencyOpts), width: 0.25, align: 'RIGHT'},
                ]);

            }

            thermalPrinter.bold(true);
            thermalPrinter.println("Payment Type Breakdown");

            thermalPrinter.tableCustom([
                {text: 'Type', width: 0.38, align: 'LEFT'},
                {text: 'Count', width: 0.16, align: 'RIGHT'},
                {text: 'Value', width: 0.25, align: 'RIGHT'},
            ]);

            thermalPrinter.bold(false);

            for (let category of reportData.totalByPaymentType) {

                thermalPrinter.tableCustom([
                    {text: category.name, width: 0.38, align: 'LEFT'},
                    {text: category.total.count, width: 0.16, align: 'RIGHT'},
                    {text: formatCurrency(category.total.amount, currencyOpts), width: 0.25, align: 'RIGHT'},
                ]);

            }

            thermalPrinter.cut();

        }
        //End loop

        let buffer = thermalPrinter.getBuffer();

        printerObj = printerObj.get({plain: true});

        for(let socket of connected){
            socket.emit('doPrint', {printerObj, buffer});
        }
    }

}