const BabyParse = require('babyparse');
const {Package, Barcode, BarcodeProductVariationItemPackage} = require('../../models');
const uuid = require('uuid');

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export.csv', {
        header: true
    });


    for(let row of data) {

        let _package = await Package.findOne({
            where: {
                Label: row.RFID
            }
        });


        if(!_package) {
            console.log(`Could not find package for ${row.RFID}`);
            continue;
        }

        let csv = BabyParse.unparse([row], {header:false});


        csv = csv.split('\r\n')[1] + "\n";

        require('fs').appendFileSync('./barcode-export-clean.csv', csv);

    }

})();