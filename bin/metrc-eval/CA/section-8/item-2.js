'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = 'A12-0000015-LIC';
    const date = moment().format('YYYY-MM-DD');

    const packageTag = '1A4FF0300000029000000121';

    await Metrc.Package.create(licenseNumber, [
        {
            Tag: packageTag,
            Room: null,
            Item: "Immature Plants",
            Quantity: 1.0,
            UnitOfMeasure: "Each",
            IsProductionBatch: false,
            ProductionBatchNumber: null,
            ProductRequiresRemediation: false,
            ActualDate: date,
            Ingredients: [
                {
                    Package: "1A4FF0300000029000000187",
                    Quantity: 1.0,
                    UnitOfMeasure: "Each"
                }
            ]
        }
    ]);

    //Change the item
    await Metrc.Package.changeItem(licenseNumber, [
        {
            "Label": packageTag,
            "Item": 'Loud Plants'
        }
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);


