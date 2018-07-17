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

//TODO: Replace this with config logo setup
//Other Place
const LOGO = "^FO295,620^GFA,2400,2400,15,,::::::::::::::::::::S0300C,Q01EJ018,Q0C003C0038,P0603JFE03,O0303LFE04,P03FEJ03FE,N021FC001C003F82,N087EI032I07E18,M011F8I022J0F84,N07CJ032J03E1,L010FK01CK078C,L023EK03EK03E,M078K063L0F1,K011EK01C0CK03C,K023CJ03F007CJ01E2,K047J01FE003F8J0F,K08EJ0FF8I0FFJ0388,J013CI03FFJ07FEI01C4,J0278I0FFEJ01FF8I0E,J04FI03FF8K0FFEI07,J08EI0IFL07FFI039,I011C001FFEL01FFC001C8,J038003FF8M0FFEI0E,I027I0IFN07FFI07,I04E001FFEN03FFC003,I01C003FF8O0FFE0039,I09C007FFI03FF8I07FF001C8,0013800FFEI03FFCI03FF800E,I07001FFCI04006J0FFC006,0026003FFJ04002J07FC007,I0E007FEJ04002J03FE003A,004C007FCJ04002J01FF0039,009C00FF8J04002K0FF801C,009801FFK060044J07F800C8,003801FEK03FFC4J01FC00C,013003FCK01FF84K0FE006,007007F8O04K07E006,026007F001FC4J04K03F007,02E00FCK04001C4K01F003,00E00FCK04001E4L0F8038,04C00F8K04I024L078038,01C01FL04I024L03C018,01C01E02J0440024L01C018,01803C1E001C47FFE4L01C01C,09803802J047FFE4M0E00C,0B80301EJ044002401K0600C80B00601E01FC4I024008J0200C80300600A01004I024008J0100E,1300401EJ04001E4418J01806,13008004J04J04008K080641301801E01004J04008K0406,1701001EJ04I02400802I0406,0703001EJ0440064J0C040206,0602070EJ047FFE4I01CF80206,2602099800804418647F03FE00306,263608BE00604410240803FC00126,267C089E004C4010040803F8001F6,264C001E00I4010040807FF8018E,264C0FJ0584010040803IF019E,267C08BE00604410240803IFE1F6,260209A2J047FFE44D87EI0306,06020F12J047FFE4I07FI020640702001EJ0440064I01BC00206,1703N04I024J09E00606,1701001C00804J044J0600406,1301801601004J04488K0C0641300C01EJ0440024488K080641300401K047FFE4488J01006,0300601EJ047FFE4488J0300E80B8030360100441024M0200C80B803822J0441024M0600C80980381EJ0441024M0C00C,01803C1CJ0441824L01C01D,01C01EL0440024L03C019,04C01FI01FC4401E4L078018,00C00F8K0478004L0F8038,00E00FCK04J04K01F003,026007EK04J04K03F003,026007FK04I024K07E007,013003F8K040024K0FE006,013003FCK07FFE4J01FC00E,00B801FEK07FFE4J03FC00C8,009800FFK041824J07F801C,001C00FF8K0182K0FF0019,004E007FEK0182J01FF0038,I0E003FFK0186J07FE0032,I07001FF8I07FFCJ0FFC006,0013801FFCI07E7CI01FF800E,0013800FFEI04L03FFI0C,I09C007FF8O0FFE001C,I04E001FFCN01FFC0039,J06I0FFEN03FF80072,J07I07FF8M07FFI0E,I0138003FFCL01FFCI0C,J09CI0FFEL03FF8001C8,K0EI07FFL07FFI039,K07I01FFCJ01FFCI07,J0338I07FEJ03FFI01E4,J019CI01FF8I0FFCI03C8,L0FJ07FC001FEJ079,L078J0FE003FK0E2,K011CK0780FK03C4,L08FL0C18K0788,L0478K037K01F3,L021EK01CK03C4,M08F8J01CJ01F,M023FJ022J07C2,M010FCI022I01F84,O03F80016I0FC1,N0187F8K0FF08,O060FFE003FF83,O0181LFC0C,P0100JF,Q03L0E,R07E003E,T03E,,::::::::::::::::::::::^FS";

//Hi Tide
// const LOGO = "^FO295,620^GFA,1470,1470,15,,:::::M02FE,M03FE0F8S07C,04K03FE07ES07E,04L03E07CS01E,04M0E07ES07E,0401CJ0E0FES07E,0401CJ0E0FES0FE,0401CJ0E0FFR01FE,0401EJ0E0NF9EF841IE,0401F9E0FE0OFEFBE3CEE,0401FFE7FE0FDPFEF5E4,0401KFE0TF78,0401FFDF7E0RF7FF98,0401FF3FFE0VF8,0401EJ0E07FE7RF8,0401CJ0E0TF3FE,I01CJ0E0UFEE,J0CJ0E0VFE,3FCL0E0LFBOFE,204K07E0VFE,30CJ03FE0WF,1F8J03FE0FF8I01FF8,O0E0FFL0FE,Q0FEL01F,3FC08J060FEM07C,I014J0E0FEM03E,J0CJ0E0FEM01F,33C1CJ0A0FEM01F,2641DFEFFEP01F8,3CC1KFEP01FC,I01KFEQ0FC,:1FC1KFE0FEM01FC,1FC1EI01E0FEM01FC,0441CJ0E0FEM03FC,07C1CJ0E0FEM03FC,J0CJ060FFM0FFC,Q0FF8K07FFE,3FCN0KFBJF74,2641CJ0E0QFC,2241CJ0E0PFDC,I01CJ0E0QFC,I01EJ0E0QFC,3FC1KFE0QF8,01C1KFE07PF8,0F01KFE0QF,3FC1FDDCFE0PFE,I01F9007E0PFC,I01CJ0E0PF8,13C1CJ0E0OFE,2641CJ0E0OF8,3CC1CJ0E0IFE003E,1801CJ0E0FF,I01CJ0E0FE,3I0EJ0E0FE,1FC0EI01E0FE,0BC0F8003C0FEM01F8,3F807E01FC0FEM01F8,J07JFC0FEM01F8,J03JF80FEM01F8,3FC03JF00FEM01F8,3FC00IFE00FEM01F8001E,06C003FF800FF8L07BI0FFC,3FCN0OFC2001FFE,Q0NFE07001IF,L02J0NF3F4003IF,03C00FF1800NFEFC003IF,3F001FF7A00OF9F803IF8,07803IFB80QF803IF8,00407JF807MFE3E803IF8,J0KFC0OF3E003IF8,J0FC107E0QF003IF,0400F0100E0OFEJ07FF,0401E0100E0NFCJ013FF,0401C010060NFCJ017FE,0401C010060MF8L07FC,0401C010070FFCQ03F,0401C010060FF,0401C0100E0FE,0400C0103E0FE,0400E01FFE0FE,0400E01FFC0FE,0400701FF807E,04003C1FD8,04001C1F8,K041B,,:::::^FS";

const THC_WARNING = "^FO255,120^GFA,3078,3078,19,,:::::::::::::::::001E003E,00210061,00210041,:001E0041,,I0F0038,003I064,002J04,001I044,003F007CU08,gH01E,I01X03E,001F807CT07F,0021I04T0FF8,M04S01FFC,L07CS03E3E,gG07C1F,gG0F80F8,001E007ER01F007C,00330044R03E003E,0021V07C001F,0021002S0F8I0F8,001E0074Q01FJ07C,L01R03EJ03E,I010054Q07EJ01F,003FC078Q07CK0F8,I01T01F8K0FC,L07CP01FL07E,L048P03EL03E,X07CL01F,I01007CP0F8M0F8,001F8004O01FN07C,0021I04O03EN03E,M04O07CN01F,L078O0F8O0F8,003FCQ01FP07C,I01004CN03EP03E,I010014N07CP01F,001F007O0F8Q0F8,L02N01FR07C,U01ER03E,001EQ03CR01F,0025Q078S0F8,0025Q0F8M0EK07C,0027007FL01FN0EK07E,I06I03L03EN0EK01E,L01CL078N0EL0F8,L07M0F8N0EL0F8,L06L01FK07IFEL03C,M0CK03EK0JFEL03E,003FI03K07CK0JFEL01F,I01007FK0F8O0EM0F8,I01N01FP0EM07C,I04N03EP0EM03E,001F0074J07CP0EM01F,0025001K0F8P0EN0F8,00250054I01FQ04N07C,0027007CI03Eg03E,Q07Cg01F,001I01J0F8gG0F8,0039007CI0FN0JFEO07C,0025I04001EN0JFEO03E,0015L03CN0JFCO01F,003EL0F8P06R0F8,L07C00F8P06I03E03IFE0FC,001EK01FQ06I03E3JFE03C,003101FC03EQ06I03E3JFE03E,0021K03EQ06I03E3JFE03E,I01K01FQ06I03E1JFE07C,L07C00F8P06R0F8,001F804I07CP0FQ01F,I07004I03EN0JFEO03E,I01006I01FN0JFEO07C,I01007CI0F8M07IFEO0F8,003EM07Cg01F,L064I03Eg01E,L054I01Fg07C,L05K0F8Y0F8,L07CJ07CM07FCN01F,001EN03EL01IFN01E,0031N01FL03IF8M03C,0021007CK0F8K07C07CM078,0021I04K07CK07801CM0F8,001EI04K03CK0EI0CL01F,M04K03EK0EI0EL03E,I010078K01FK0EI0EL078,003FCO0F8J0EI06L0F8,I010064L07CJ0EI0EK01F,L054L03EJ06I0EK03E,L054L01FJ06I0CK07C,L07CM0F8I030018K0F8,U07CR01F,001EQ03ER03E,0021004N01FR07C,0021R0F8Q0F8,I01R07CP01F,V03EP03E,003FCQ01FP07C,I01S0F8O0F8,I01007FO078O0F8,001FI0CO03CN01F,I080036O01EN03E,L061P0F8M078,003F404Q07CM0F8,L038P03CL01F,L07CP03EL03E,003FC05Q01FL07C,L014Q0F8K0F8,001E005CQ07CJ01F,0033U03EJ03E,00210038Q01FJ07C,0011005CR0F8I0F8,003FC01S07C001F,L014R03E003E,L05CR01F007C,003FW0F80F8,I01W07C1F,I0101FCS03E3E,I0C0044S01F7C,001F0044T0FF8,0025007CT07F8,0025X03F,I06X03E,gH01C,,001F,I01,:001F,,:003,,::::::::::^FS";

const HEALTH_DISCLAIMER = "^FO120,290^A0R,15,15^FB500,11,0,L,0^FD There may be health risks associated with the consumption of this product. This marijuana’s potency was tested with an allowable plus or minus 15% variance pursuant to 12-43.4-202(3)(a)(IV)(E), C.R.S. There may be additional health risks associated with the consumption of this product for women who are pregnant, breast feeding, or planning on becoming pregnant. Do not drive or operate heavy machinery while using marijuana. The marijuana contained within this package complies with the  mandatory contaminant testing required by rule R 1501. ^FS"

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

    let store = await Store.findOne({
        where: {
            id: args.storeId
        }
    });

    let retailLicense = store.licenseNumber;


    //Get receipt with associated data
    let receipt = await Receipt.findOne({
        where: {
            id: args.receiptId
        },
        include: [
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
                                model: Package,
                                include: [
                                    {
                                        model: Item,
                                        include: [
                                            {
                                                model: Supplier
                                            }
                                        ]
                                    },
                                    {
                                        model: Supplier
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: ProductVariation
                    }
                ]
            }
        ]
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

        let bulkFlowerLineItems = receipt.LineItems.filter(lineItem => lineItem.ProductVariation.isBulkFlower);

        for(let lineItem of bulkFlowerLineItems){

            let _package = lineItem.Transactions[0].Package;

            let barcode = lineItem.Barcode.barcode;
            let budName = lineItem.Product.name;
            let weight = `${lineItem.quantity} g`;
            let strainType = _package.strainType.toUpperCase();
            let percentagesString = `${formatPercentages(_package.thcPercent.toString())} THC / ${formatPercentages(_package.cbdPercent.toString())} CBD`;
            let ingredients = `Ingredients: ${_package.ingredients}`;
            let packagedDate = moment(_package.PackagedDate).format("MM/DD/YYYY");
            let cultivatorLicense = _package.Supplier.licenseNumber;
            let harvestBatchNum = _package.Label.slice(-5);
            let dateOfSale = moment().tz(store.timeZone).format("MM/DD/YYYY");
            let metrcTag = _package.Label;


            let labelString =
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
                FIELD_ORIGIN + "80,290" +
                FONT_ROTATED +
                TWO_LINE_FB +
                FIELD_START +
                "DATE OF SALE" + NEWLINE + dateOfSale +
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

            let buffer = Buffer.from(labelString, 'ascii');

            for(let socket of connected){
                socket.emit('printTransactionLabel', {printerObj, buffer});
            }

        }

    }




}
