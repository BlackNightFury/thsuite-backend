
const printer = require('printer');
const moment = require('moment');

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

module.exports = async function(printerObj){

    let companyLine = 'COMPANY NAME HERE';
    let productLine = 'TEST LABEL TEST LABEL';
    let licenseLine = 'LIC# XXXX-XXXXX';
    let dateLine = moment().format("MM/DD/YYYY");
    let labelLine = 'TEST LABEL TEST LABEL';
    let productVariationLine = 'TEST TEST';


    let labelString = START_LABEL + FONT + CENTER + FIELD_START + companyLine + FIELD_END;

    let leftAlignedText = productLine + NEWLINE + licenseLine + NEWLINE + dateLine + NEWLINE + labelLine + NEWLINE + productVariationLine;

    labelString += FIELD_ORIGIN + "40,60" + FONT + LEFT + FIELD_START + leftAlignedText + FIELD_END + END_LABEL;

    let buffer = Buffer.from(labelString, 'ascii');

    console.log(buffer);

    printer.printDirect({
        data: buffer,
        printer: printerObj.name,
        type: 'RAW',
        success: function (jobId) {
            console.log(`Printing with job id ${jobId}`);
        },
        error: function (err) {
            console.log('Error printing');
            console.error(err);
        }
    });

};
