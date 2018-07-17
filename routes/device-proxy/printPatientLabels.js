const { Printer, Device, Receipt, LineItem, Transaction, Supplier, Product, ProductType, ProductVariation, Package, Patient, Physician, Item } = alias.require('@models');
const uuid = require('uuid');
const moment = require('moment');

const config = require('../../config/index');

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

    let patient = await Patient.findOne({
        where: {
            id: args.patientId
        },
        include: [
            {
                model: Physician
            }
        ]
    });

    let receipt = await Receipt.findOne({
        where: {
            id: args.receiptId
        },
        include: [
            {
                model: LineItem,
                include: [
                    {
                        model: Transaction
                    }
                ]
            }
        ]
    });

    let labelData = [];

    for(let lineItem of receipt.LineItems){
        //Need to get to the transaction level and send one for each transaction
        for(let transaction of lineItem.Transactions){
            let packageId = transaction.packageId;
            let productId = transaction.productId;
            let productVariationId = transaction.productVariationId;

            let _package = await Package.findOne({
                where: {
                    id: packageId
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
                productType: productType,
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
    }else {
        if (connected.length >= 2) {
            console.log("MULTIPLE CONNECTED SOCKETS");
            console.log(connected);
        }

        printerObj = printerObj.get({plain: true});

        let patientLine = `PATIENT: ${patient.firstName.toUpperCase()} ${patient.lastName.toUpperCase()}`;
        let patientIdLine = `PT ID: ${patient.medicalStateId}`;
        let physicianLine = `PHYSICIAN: ${(patient.Physician.firstName + ' ' + patient.Physician.lastName).toUpperCase()}`;

        let dateLine = `DATE OF SALE: ${moment().format("MM/DD/YYYY")}`;
        let dispensaryLine = `DISPENSARY: ${config.environment.companyName.toUpperCase()}`;
        let addressLine= `ADDRESS: ${config.environment.addressInformation.address1.toUpperCase()} ${config.environment.addressInformation.address2.toUpperCase()}`;
        let phoneLine = `PHONE: ${config.environment.phone}`;

        //TODO: May be product type specific
        let directionsLine = `STORAGE: STORE IN A COOL DRY PLACE`;


        for(let data of labelData){

            let {
                _package,
                product,
                productVariation,
                productType
            } = data;

            //Label contents
            let productLine = `PRODUCT: ${product.name.toUpperCase()} - ${productVariation.quantity}${_package.UnitOfMeasureAbbreviation.toUpperCase()}`;
            let productTypeLine = `TYPE: ${productType.name}`;

            let sourceLine = `SUPPLIER: ${_package.Item.Supplier.name.toUpperCase()}`;
            let lotLine = `LOT #: ${_package.Label}`;

            let cannabinoidLine = `CANNABINOIDS:${_package.ingredients}`;

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
                + lotLine

            let labelString = START_LABEL + FONT + LEFT + FIELD_START + labelBody + FIELD_END + END_LABEL;

            let buffer = Buffer.from(labelString, 'ascii');

            for(let socket of connected){
                socket.emit('printTransactionLabel', {printerObj, buffer});
            }

        }



    }
}
