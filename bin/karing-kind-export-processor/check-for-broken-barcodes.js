const BabyParse = require('babyparse');
const {Package, Barcode, BarcodeProductVariationItemPackage} = require('../../models');
const uuid = require('uuid');

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export.csv', {
        header: true
    });


    for(let row of data) {
        if(row['QTY ON HAND'] > 0) {
            // console.log(`QTY ON HAND for ${row.RFID} has quantity`);
            continue;
        }

        let _package = await Package.findOne({
            where: {
                Label: row.RFID
            }
        });

        if(!_package) {
            // console.log(`Could not find package for ${row.RFID}`);
            continue;
        }

        if(_package.Quantity > 0) {
            console.log(`${row.RFID} has quantity in metrc (${_package.Quantity}) but none in export (${row['QTY ON HAND']})`);
            continue;
        }

    }

})();