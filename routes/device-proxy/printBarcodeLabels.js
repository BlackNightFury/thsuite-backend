const { Printer, Device, DeliveryPackage, Barcode, Package, ProductVariation, Product, PricingTier, PricingTierWeight } = alias.require('@models');
const ProxySocketCache = require('./proxy-socket-cache');

const moment = require('moment');

const formatCurrency = require('format-currency');
const currencyOpts = { format: '%s%v', code: 'USD', symbol: '$' };

const config = require('../../config');

//Command CONST
const LABEL_WIDTH_IN = config.environment.barcodeLabelWidth; //In inches
const LABEL_DPI = 203;

const LABEL_WIDTH_DOTS = Math.ceil(LABEL_DPI * LABEL_WIDTH_IN);

//NOTE: The number after the first comma in the string below is the number of lines in this block
const CENTER = "^FB" + LABEL_WIDTH_DOTS + ",3,0,C,0";

const LEFT = "^FB" + LABEL_WIDTH_DOTS + ",5,0,L,0";

const START_LABEL = "^XA^FO20,30";

const START_LABEL_SMALL = "^XA^FO25,10";

const FIELD_ORIGIN = "^FO";

const END_LABEL = "^XZ";

const FONT_LARGE = "^A0N,35,35";

const FONT = "^A0N,25,25";

const FONT_SMALL = "^A0N,20,20";

const FONT_SMALLER = "^A0N,15,15";

const BARCODE_FORMAT = `^BY${config.environment.barcodeLabelWidth < 2 ? "1" : "2"}`;

const CODE39_BARCODE = "^B3N,N,75,Y,N";

const FIELD_START = "^FD";

const FIELD_END = "^FS";

const NEWLINE = "\\&";

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
        }
    });

    let barcode = barcodeObj.barcode;
    let name = productVariation.Product.name.slice(0, 22) + ' - ' + productVariation.name;

    let amount = args.amount;

    let label = _package.Label;

    let deliveryPackage = await DeliveryPackage.findOne({
        where: {
            packageId: args.packageId
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

        let textBody;
        let priceLine;

        if(args.type == 'cannabis') {

            let receivedDateString;

            if(config.environment.receivedDateOnBarcodeLabels){
                receivedDateString = deliveryPackage ? "Received: " + moment(deliveryPackage.ReceivedDateTime).format("MM/DD/YYYY") : "";
            }else{
                receivedDateString = "";
            }

            textBody = name + NEWLINE + label + NEWLINE + receivedDateString;

            if(config.environment.priceOnCannabisBarcodeLabels && !config.environment.receivedDateOnBarcodeLabels) {
                //Calculate price
                if (productVariation.Product.inventoryType == 'weight') {
                    //Pricing tier time
                    let pricingTier = await PricingTier.findOne({
                        where: {
                            id: productVariation.Product.pricingTierId
                        },
                        include: [
                            {
                                model: PricingTierWeight
                            }
                        ]
                    });

                    if (pricingTier) {
                        let productWeight = productVariation.quantity;
                        let unitPrice = 0;
                        for (let tierWeight of pricingTier.PricingTierWeights) {
                            if (productWeight >= tierWeight.weight) {
                                unitPrice = tierWeight.price;
                            }
                        }
                        let price = unitPrice * productWeight;
                        priceLine = formatCurrency(price, currencyOpts);
                    }
                } else {
                    priceLine = formatCurrency(productVariation.price, currencyOpts);
                }
            }

        }else if(args.type == 'non-cannabis'){

            textBody = productVariation.Product.name.slice(0,25) + NEWLINE;
            priceLine = formatCurrency(productVariation.price, currencyOpts);

        }

        let labelString =
            (config.environment.barcodeLabelWidth < 2 ? START_LABEL_SMALL : START_LABEL) +
            BARCODE_FORMAT +
            CODE39_BARCODE +
            FIELD_START +
            barcode +
            FIELD_END +
            FIELD_ORIGIN +
            (config.environment.barcodeLabelWidth < 2 ? "0,105" + FONT_SMALLER : "0,140" + FONT_SMALL)  +
            CENTER +
            FIELD_START +
            textBody +
            FIELD_END +
            (priceLine ?    FIELD_ORIGIN + (config.environment.barcodeLabelWidth < 2 ? "70,130" + FONT_LARGE : "180,180" + FONT_SMALL) +
                            FIELD_START +
                            priceLine +
                            FIELD_END : '') +
            END_LABEL;

        console.log(labelString);

        let buffer = Buffer.from(labelString, 'ascii');

        console.log(buffer);

        for(let socket of connected){
            console.log(socket);
            for(let i = 0; i < amount; i++){
                socket.emit('printBarcodeLabel', {printerObj, buffer});
            }
        }
    }

}
