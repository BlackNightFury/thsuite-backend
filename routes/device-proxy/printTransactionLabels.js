const { Printer, Device, Receipt, LineItem, Product, ProductType, ProductVariation, Package } = alias.require('@models');
const uuid = require('uuid');
const moment = require('moment');

const config = require('../../config');

const ProxySocketCache = require('./proxy-socket-cache');

//Command CONST
const LABEL_WIDTH_IN = 2;
const LABEL_DPI = 203;

const LABEL_WIDTH_DOTS = LABEL_DPI * LABEL_WIDTH_IN;

const CENTER = "^FB" + LABEL_WIDTH_DOTS + ",1,0,C,0";

const LEFT = "^FB" + LABEL_WIDTH_DOTS + ",5,0,L,0";

const START_LABEL = "^XA^FO30,30";

const FIELD_ORIGIN = "^FO";

const END_LABEL = "^XZ";

const FONT = "^A0N,25,25";

const BARCODE_FORMAT = "^BY2";

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

    let labelData = [];

    for(let lineItem of args.receipt.LineItems){
        //Need to get to the transaction level and send one for each transaction
        for(let transaction of lineItem.Transactions){
            let packageId = transaction.packageId;
            let productId = transaction.productId;
            let productVariationId = transaction.productVariationId;

            let _package = await Package.findOne({
                where: {
                    id: packageId
                }
            });

            let product = await Product.findOne({
                where: {
                    id: productId
                }
            });

            let productType = await ProductType.findOne({
                where: {
                    id: product.productTypeId
                }
            });

            let productVariation = await ProductVariation.findOne({
                where: {
                    id: productVariationId
                }
            });

            let data = {
                _package: _package,
                product: product,
                productVariation: productVariation,
                licenseNumber: args.licenseNumber
            };

            for(let i = 0; i < lineItem.quantity; i++){
                if(productType.category == 'cannabis'){
                    labelData.push(data);
                }
            }
        }
    }

    let sockets = ProxySocketCache.get(printerObj.deviceProxyId);

    let connected = sockets.filter(socket => socket.connected);

    if(connected.length == 0){
        console.log("NO CONNECTED SOCKETS");
        ProxySocketCache.showCaches();
    }else{
        if(connected.length >= 2){
            console.log("MULTIPLE CONNECTED SOCKETS");
            console.log(connected);
        }

        printerObj = printerObj.get({plain: true});

        for(let socket of connected){

            for(let data of labelData){

                let {
                    _package,
                    product,
                    productVariation,
                    licenseNumber,
                } = data;

                let companyLine = config.environment.companyName;
                let productLine = product.name.slice(0,25);
                let licenseLine = "LIC# " + licenseNumber;
                let dateLine = moment().format("MM/DD/YYYY");
                // let labelLine = _package.Label;
                let productVariationLine = (productVariation.quantity + ' ' +  _package.UnitOfMeasureName.toLowerCase()).slice(0,25);


                let labelString = START_LABEL + FONT + CENTER + FIELD_START + companyLine + FIELD_END;

                let leftAlignedText = productLine + NEWLINE + licenseLine + NEWLINE + dateLine  + NEWLINE + productVariationLine;

                labelString += FIELD_ORIGIN + "40,60" + FONT + LEFT + FIELD_START + leftAlignedText + FIELD_END + END_LABEL;

                let buffer = Buffer.from(labelString, 'ascii');

                if(config.environment.printTransactionLabels){
                    socket.emit('printTransactionLabel', {printerObj, buffer});
                }

            }
        }

    }
}
