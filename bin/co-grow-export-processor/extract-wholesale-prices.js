const BabyParse = require('babyparse');
const {Package} = require('../../models');

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export-clean.csv', {
        header: true
    });


    let labelWholesaleMap = Object.create(null);

    for(let row of data) {
        labelWholesaleMap[row.RFID] = labelWholesaleMap[row.RFID] || [];

        labelWholesaleMap[row.RFID].push(row);
    }

    let multiplePriceLabels = [];

    for(let label of Object.keys(labelWholesaleMap)) {

        let _package = await Package.findOne({
            where: {
                Label: label
            }
        });

        if(!_package) {
            console.log(`Could not find package for ${label}`);
            continue;
        }

        if(labelWholesaleMap[label].length == 1) {

            let row = labelWholesaleMap[label][0];

            _package.wholesalePrice = row['BUY PRICE'] * _package.ReceivedQuantity;

            // await _package.save();
            console.log(`Package ${label} has wholesale price ${_package.wholesalePrice}`);

            await _package.save();
        }
        else {
            let row = labelWholesaleMap[label];

            console.log(`Found ${row.length} rows for package ${label}`);

            let firstBuyPrice = row[0]['BUY PRICE'];
            if(row.every(buyPrice => buyPrice['BUY PRICE'] == firstBuyPrice)) {
                _package.wholesalePrice = firstBuyPrice * _package.ReceivedQuantity;
                console.log(`Package ${label} has wholesale price ${_package.wholesalePrice}`);
                await _package.save();
            }
            else {
                console.log(`Multiple prices for package ${label}`);
                multiplePriceLabels.push(label);
            }
        }

    }

    console.log("The following labels had multiple prices");
    console.log(JSON.stringify(multiplePriceLabels));

})();