const { Printer, Device, Receipt, LineItem, Supplier, Product, ProductType, ProductVariation, Package, Patient, Item } = alias.require('@models');
const uuid = require('uuid');
const moment = require('moment');

const config = require('../../config');

const ProxySocketCache = require('./proxy-socket-cache');

//Command CONST
const LABEL_WIDTH_IN = 2;
const LABEL_DPI = 203;

const LABEL_WIDTH_DOTS = LABEL_DPI * LABEL_WIDTH_IN;

const CENTER = "^FB" + LABEL_WIDTH_DOTS + ",1,0,C,0";

const LEFT = "^FB" + LABEL_WIDTH_DOTS + ",16,0,L,0";

const START_LABEL = "^XA^FO30,30";

const FIELD_ORIGIN = "^FO";

const END_LABEL = "^XZ";

const FONT = "^A0N,20,20";

const BARCODE_FORMAT = "^BY2";

const CODE39_BARCODE = "^B3N,N,75,Y,N";

const FIELD_START = "^FD";

const FIELD_END = "^FS";

const NEWLINE = "\\&";

module.exports = async function(args) {

    let printerId = args.printerId;
    let deviceId = args.posDeviceId;

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

        printerObj = printerObj.get({plain: true});

        let patientLine = `PATIENT: ROBERT DAVIS`;
        let patientIdLine = `PT ID: P90M-2193-1589-049G`;
        let physicianLine = `PHYSICIAN: DR. JOHN SMITH`;

        let dateLine = `DATE OF SALE: ${moment().format("MM/DD/YYYY")}`;
        let dispensaryLine = `DISPENSARY: ${config.environment.companyName.toUpperCase()}`;
        let addressLine= `ADDRESS: ${config.environment.addressInformation.address1.toUpperCase()} ${config.environment.addressInformation.address2.toUpperCase()}`;
        let phoneLine = `PHONE: ${config.environment.phone}`;

        //TODO: May be product type specific
        let directionsLine = `STORAGE: STORE IN A COOL DRY PLACE`;

        let cannabinoidLine = `CANNABINOIDS: THC: 100mg`;

        //Label contents
        let productLine = `PRODUCT: CHERRY DIESEL - 3.5G`;
        let productTypeLine = `TYPE: BUDS`;

        let sourceLine = `SUPPLIER: TRILL THERAPEUTICS LLC`;
        let lotLine = `LOT #: 1A400031266F14F000000292`;

        let labelBody = patientLine + NEWLINE
            + patientIdLine + NEWLINE
            + physicianLine + NEWLINE
            + productLine + NEWLINE
            + productTypeLine + NEWLINE
            + dateLine + NEWLINE
            + dispensaryLine + NEWLINE
            + addressLine + NEWLINE
            + phoneLine + NEWLINE
            + sourceLine + NEWLINE
            + directionsLine + NEWLINE
            + cannabinoidLine + NEWLINE
            + lotLine;

        let labelString = START_LABEL + FONT + LEFT + FIELD_START + labelBody + FIELD_END + END_LABEL;

        let buffer = Buffer.from(labelString, 'ascii');

        for(let socket of connected){
            socket.emit('printTransactionLabel', {printerObj, buffer});
        }



    }
}

