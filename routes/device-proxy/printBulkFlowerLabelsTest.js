const { Printer, Device, Receipt, LineItem, Package, Product, ProductVariation, Item, Barcode, Discount, Transaction, Supplier, Store} = alias.require('@models');
const uuid = require('uuid');
const moment = require('moment');
require('moment-timezone');

const config = require('../../config');

const ProxySocketCache = require('./proxy-socket-cache');

//Command CONST
const LABEL_WIDTH_IN = 2;
const LABEL_DPI = 203;

const LABEL_WIDTH_DOTS = LABEL_DPI * LABEL_WIDTH_IN;

const FIELD_BLOCK = "^FB";

const STANDARD_FB = ",0,L,0";

const TWO_LINE_FB = "^FB120,2,0,L,0";

const TWO_LINE_FB_BIG = "^FB200,2,0,L,0";

const TWO_LINE_FB_EXTRA_BIG = "^FB250,2,0,L,0";

const START_LABEL = "^XA^FO30,30";

const FIELD_ORIGIN = "^FO";

const END_LABEL = "^XZ";

const FONT_ROTATED_BIG = "^A0R,25,25";

const FONT_ROTATED = "^A0R,20,20";

const FONT_ROTATED_SMALL = "^A0R,16,16";

const BARCODE_FORMAT = "^BY2";

const CODE39_BARCODE = "^B3N,N,75,Y,N";

const FIELD_START = "^FD";

const FIELD_END = "^FS";

const NEWLINE = "\\&";

const LOGO = config.environment.bulkFlowerInformation.ZPLLogo;

const HEALTH_DISCLAIMER = config.environment.bulkFlowerInformation.healthDisclaimer;

const PERCENTAGE_BOX = "^FO295,290^GB40,290,2^FS";

let formatPercentages = (percent) => {

    //Split on the decimal, left pad pre decimal, right pad post decimal
    let [pre, post] = percent.split('.');
    if(pre){
        pre = pre.length == 1 ? "0" + pre : pre;
    }else{
        pre = "00";
    }

    if(post){
        post = post.length == 1 ? post + "0" : post;
    }else{
        post = "00"
    }

    return `${pre}.${post}%`;

};

module.exports = async function(args){

    let printerId = args.printerId;
    let deviceId = args.posDeviceId;

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

        let barcode = "123456789";
        let budName = "Cherry Diesel";
        let weight = `3.5 g`;
        let strainType = "SATIVA";
        let percentagesString = `${formatPercentages("12")} THC / ${formatPercentages("3")} CBD`;
        let ingredients = "Cannabinoids:" + NEWLINE + " THC 24.5mg, THC-A 598.5mg, CBD 0.0mg, CBD-A 0.0mg, CBG 0.0mg, CBN 0.0mg" + NEWLINE + "Terpenes:" + NEWLINE +"a-Pinene 6.3mg, B-Pinene 3.9mg, B-Myrcene 12.6mg, Limonene 7.7mg, Ocimene 11.6mg, Linalool 0.0mg, B-Caryophyllene 4.6mg, Humulene 0.0mg ";
        let packagedDate = "01/20/2018";
        let cultivatorName = "TRILL THERAPEUTICS LLC";
        let harvestBatchNum = "00292";
        let expirationDate = moment().tz('America/New_York').add(30, 'day').format("MM/DD/YYYY");
        let metrcTag = "1A400031266F14F000000292";


        let labelString =
            START_LABEL +
            LOGO +
            // THC_WARNING +
            FIELD_ORIGIN + "30,20" +
            BARCODE_FORMAT + ",3" +
            CODE39_BARCODE +
            FIELD_START +
            barcode +
            FIELD_END +
            FIELD_ORIGIN + "365,290" +
            FONT_ROTATED_BIG +
            FIELD_START +
            budName +
            FIELD_END +
            FIELD_ORIGIN + "335,290" +
            FONT_ROTATED_BIG +
            FIELD_START +
            strainType + " - " + weight +
            FIELD_END +
            PERCENTAGE_BOX +
            FIELD_ORIGIN + "300,300" +
            FONT_ROTATED_BIG +
            FIELD_START +
            percentagesString +
            FIELD_END +
            HEALTH_DISCLAIMER +
            FIELD_ORIGIN + "0,130" +
            FONT_ROTATED_SMALL +
            FIELD_BLOCK + "162,24" + STANDARD_FB +
            FIELD_START +
            ingredients +
            FIELD_END +
            FIELD_ORIGIN + "130,290" +
            FONT_ROTATED +
            TWO_LINE_FB +
            FIELD_START +
            "PACKAGED" + NEWLINE + packagedDate +
            FIELD_END +
            FIELD_ORIGIN + "130,420" +
            FONT_ROTATED +
            TWO_LINE_FB_EXTRA_BIG +
            FIELD_START +
            "CULTIVATOR NAME" + NEWLINE + cultivatorName +
            FIELD_END +
            // FIELD_ORIGIN + "130,620" +
            // FONT_ROTATED +
            // TWO_LINE_FB_BIG +
            // FIELD_START +
            // "HARVEST BATCH" + NEWLINE + harvestBatchNum +
            // FIELD_END +
            FIELD_ORIGIN + "80,290" +
            FONT_ROTATED +
            TWO_LINE_FB_BIG +
            FIELD_START +
            "EXPIRATION" + NEWLINE + expirationDate +
            FIELD_END +
            FIELD_ORIGIN + "80,420" +
            FONT_ROTATED +
            TWO_LINE_FB_EXTRA_BIG +
            FIELD_START +
            "LOT #" + NEWLINE + metrcTag +
            FIELD_END +
            // FIELD_ORIGIN + "30,290" +
            // FONT_ROTATED +
            // TWO_LINE_FB_BIG +
            // FIELD_START +
            // "RETAIL LICENSE" + NEWLINE + "402R-00343" +
            END_LABEL;

        let buffer = Buffer.from(labelString, 'ascii');

        for(let socket of connected){
            socket.emit('printTransactionLabel', {printerObj, buffer});
        }

    }




}