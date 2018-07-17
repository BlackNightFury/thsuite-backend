require('../../init');

const {Package, Transaction, Alert, BarcodeProductVariationItemPackage, Barcode} = alias.require('@models');
const Metrc = alias.require('@lib/metrc');
const BabyParse = require('babyparse');


(async function() {
    let packages = await Metrc.Package.listActive('402R-00176')

    let packagesWithQuantity = [];
    for(let _package of packages) {
        if(_package.Quantity <= 0) {
            continue;
        }

        let transactions = await Transaction.findAll({
            where: {
                PackageLabel: _package.Label,
                sentToMetrc: null
            }
        });

        let soldQuantity = transactions.reduce((acc, trans) => acc + trans.QuantitySold, 0);

        packagesWithQuantity.push({
            Label: _package.Label,
            Quantity: (_package.Quantity - soldQuantity).toFixed(3)
        });
    }



    let csv = BabyParse.unparse(packagesWithQuantity);

    require('fs').writeFileSync('./latest-inventory.csv', csv);

    console.log("Found " + packagesWithQuantity.length + " packages");
})();