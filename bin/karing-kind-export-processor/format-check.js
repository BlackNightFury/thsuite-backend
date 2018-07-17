const BabyParse = require('babyparse');
const {Package, Barcode, BarcodeProductVariationItemPackage} = require('../../models');
const uuid = require('uuid');


function extractWeightInGrams(row) {

    if(/([\d.]+)g/i.exec(row.NAME)) {
        return /([\d.]+)g/i.exec(row.NAME)[1];
    }

    if(/([\d.])mg/i.exec(row.NAME)) {
        return /([\d.])mg/i.exec(row.NAME)[1] / 1000;
    }

    return 1;
}

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export.csv', {
        header: true
    });

    let labelWholesaleMap = Object.create(null);

    for(let row of data) {

        let label = row['Plant/Package RFID'];

        if(!label) {
            continue;
        }

        if(!labelWholesaleMap[label]) {
            labelWholesaleMap[label] = row;
        }
        else {
            console.log(`Duplicate RFID ${label}`);
        }

    }

})();