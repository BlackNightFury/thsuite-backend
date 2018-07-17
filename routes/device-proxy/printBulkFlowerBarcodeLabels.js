const { Printer, Device, Receipt, LineItem, Package, Product, ProductVariation, Item, Barcode, Discount, Transaction, Supplier, Store} = alias.require('@models');
const uuid = require('uuid');
const moment = require('moment');
require('moment-timezone');

const config = require('../../config/index');

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

const TWO_LINE_FB_HUGE = "^FB350,2,0,L,0";

const START_LABEL = "^XA^FO30,30";

const FIELD_ORIGIN = "^FO";

const END_LABEL = "^XZ";

const FONT_ROTATED_BIG = "^A0R,25,25";

const FONT_ROTATED = "^A0R,20,20";

const FONT_ROTATED_SMALL = "^A0R,15,15";

const BARCODE_FORMAT = "^BY2";

const CODE39_BARCODE = "^B3N,N,75,Y,N";

const FIELD_START = "^FD";

const FIELD_END = "^FS";

const NEWLINE = "\\&";

const LOGO = config.environment.bulkFlowerInformation.ZPLLogo;

const HEALTH_DISCLAIMER = config.environment.bulkFlowerInformation.healthDisclaimer;

const THC_WARNING = "^FO255,120^GFA,3078,3078,19,,:::::::::::::::::001E003E,00210061,00210041,:001E0041,,I0F0038,003I064,002J04,001I044,003F007CU08,gH01E,I01X03E,001F807CT07F,0021I04T0FF8,M04S01FFC,L07CS03E3E,gG07C1F,gG0F80F8,001E007ER01F007C,00330044R03E003E,0021V07C001F,0021002S0F8I0F8,001E0074Q01FJ07C,L01R03EJ03E,I010054Q07EJ01F,003FC078Q07CK0F8,I01T01F8K0FC,L07CP01FL07E,L048P03EL03E,X07CL01F,I01007CP0F8M0F8,001F8004O01FN07C,0021I04O03EN03E,M04O07CN01F,L078O0F8O0F8,003FCQ01FP07C,I01004CN03EP03E,I010014N07CP01F,001F007O0F8Q0F8,L02N01FR07C,U01ER03E,001EQ03CR01F,0025Q078S0F8,0025Q0F8M0EK07C,0027007FL01FN0EK07E,I06I03L03EN0EK01E,L01CL078N0EL0F8,L07M0F8N0EL0F8,L06L01FK07IFEL03C,M0CK03EK0JFEL03E,003FI03K07CK0JFEL01F,I01007FK0F8O0EM0F8,I01N01FP0EM07C,I04N03EP0EM03E,001F0074J07CP0EM01F,0025001K0F8P0EN0F8,00250054I01FQ04N07C,0027007CI03Eg03E,Q07Cg01F,001I01J0F8gG0F8,0039007CI0FN0JFEO07C,0025I04001EN0JFEO03E,0015L03CN0JFCO01F,003EL0F8P06R0F8,L07C00F8P06I03E03IFE0FC,001EK01FQ06I03E3JFE03C,003101FC03EQ06I03E3JFE03E,0021K03EQ06I03E3JFE03E,I01K01FQ06I03E1JFE07C,L07C00F8P06R0F8,001F804I07CP0FQ01F,I07004I03EN0JFEO03E,I01006I01FN0JFEO07C,I01007CI0F8M07IFEO0F8,003EM07Cg01F,L064I03Eg01E,L054I01Fg07C,L05K0F8Y0F8,L07CJ07CM07FCN01F,001EN03EL01IFN01E,0031N01FL03IF8M03C,0021007CK0F8K07C07CM078,0021I04K07CK07801CM0F8,001EI04K03CK0EI0CL01F,M04K03EK0EI0EL03E,I010078K01FK0EI0EL078,003FCO0F8J0EI06L0F8,I010064L07CJ0EI0EK01F,L054L03EJ06I0EK03E,L054L01FJ06I0CK07C,L07CM0F8I030018K0F8,U07CR01F,001EQ03ER03E,0021004N01FR07C,0021R0F8Q0F8,I01R07CP01F,V03EP03E,003FCQ01FP07C,I01S0F8O0F8,I01007FO078O0F8,001FI0CO03CN01F,I080036O01EN03E,L061P0F8M078,003F404Q07CM0F8,L038P03CL01F,L07CP03EL03E,003FC05Q01FL07C,L014Q0F8K0F8,001E005CQ07CJ01F,0033U03EJ03E,00210038Q01FJ07C,0011005CR0F8I0F8,003FC01S07C001F,L014R03E003E,L05CR01F007C,003FW0F80F8,I01W07C1F,I0101FCS03E3E,I0C0044S01F7C,001F0044T0FF8,0025007CT07F8,0025X03F,I06X03E,gH01C,,001F,I01,:001F,,:003,,::::::::::^FS";

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

    let amount = args.amount;

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
            id: args.storeId
        }
    });

    let retailLicense = store.licenseNumber;


    let barcodeObj = await Barcode.findOne({
        where: {
            id: args.barcodeId
        }
    });

    let productVariation = await ProductVariation.findOne({
        where: {
            id: args.productVariationId
        },
        include: [
            {
                model: Product
            }
        ]
    });

    let _package = await Package.findOne({
        where: {
            id: args.packageId
        },
        include: [
            {
                model: Item,
                include: [
                    {
                        model: Supplier
                    }
                ]
            }
        ]
    });

    // //Get receipt with associated data
    // let receipt = await Receipt.findOne({
    //     where: {
    //         id: args.receiptId
    //     },
    //     include: [
    //         {
    //             model: LineItem,
    //             include: [
    //                 {
    //                     model: Discount
    //                 },
    //                 {
    //                     model: Barcode
    //                 },
    //                 {
    //                     model: Product
    //                 },
    //                 {
    //                     model: Transaction,
    //                     include: [
    //                         {
    //                             model: Package,
    //                             include: [
    //                                 {
    //                                     model: Item,
    //                                     include: [
    //                                         {
    //                                             model: Supplier
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     model: ProductVariation
    //                 }
    //             ]
    //         }
    //     ]
    // });

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


        let barcode = barcodeObj.barcode;
        let budName = productVariation.Product.name;
        let weight = `${productVariation.quantity} g`;
        let strainType = _package.strainType.toUpperCase();
        let percentagesString = `${formatPercentages(_package.thcPercent ? _package.thcPercent.toString() : '0')} THC / ${formatPercentages(_package.cbdPercent ? _package.cbdPercent.toString() : '0')} CBD`;
        let ingredients = `Ingredients: ${_package.ingredients}`;
        let packagedDate = moment(_package.PackagedDate).format("MM/DD/YYYY");
        let cultivatorLicense = _package.Item.Supplier.licenseNumber;
        let harvestBatchNum = _package.Label.slice(-5);
        let cultivatorName = _package.Item.Supplier.name;
        let expirationDate = moment(_package.PackagedDate).tz(store.timeZone).add(1, 'years').format("MM/DD/YYYY");
        let metrcTag = _package.Label;

        let labelString;

        if(config.environment.bulkFlowerInformation.format == "MD"){
            labelString =
                START_LABEL +
                LOGO +
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
                TWO_LINE_FB_HUGE +
                FIELD_START +
                "CULTIVATOR NAME" + NEWLINE + cultivatorName +
                FIELD_END +
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
                END_LABEL;

        } else if(config.environment.bulkFlowerInformation.format == "CO"){
            labelString =
                START_LABEL +
                LOGO +
                THC_WARNING +
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
                FIELD_ORIGIN + "40,130" +
                FONT_ROTATED_SMALL +
                FIELD_BLOCK + "150,14" + STANDARD_FB +
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
                TWO_LINE_FB_BIG +
                FIELD_START +
                "CULTIVATOR LICENSE" + NEWLINE + cultivatorLicense +
                FIELD_END +
                FIELD_ORIGIN + "130,620" +
                FONT_ROTATED +
                TWO_LINE_FB_BIG +
                FIELD_START +
                "HARVEST BATCH" + NEWLINE + harvestBatchNum +
                FIELD_END +
                FIELD_ORIGIN + "80,420" +
                FONT_ROTATED +
                TWO_LINE_FB_EXTRA_BIG +
                FIELD_START +
                "METRC TAG" + NEWLINE + metrcTag +
                FIELD_END +
                FIELD_ORIGIN + "30,290" +
                FONT_ROTATED +
                TWO_LINE_FB_BIG +
                FIELD_START +
                "RETAIL LICENSE" + NEWLINE + retailLicense +
                END_LABEL;
        }

        let buffer = Buffer.from(labelString, 'ascii');

        for(let socket of connected){
            for(let i = 0; i < amount; i++) {
                socket.emit('printTransactionLabel', {printerObj, buffer});
            }
        }

    }




}
