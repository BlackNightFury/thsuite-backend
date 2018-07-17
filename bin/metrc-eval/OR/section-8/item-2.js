'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '050-X0002';
    const date = moment().format('YYYY-MM-DD');

    const packageTag = '1A4FFFB0007A122000003474';

    await Metrc.Package.create(licenseNumber, [
        {
            Tag: packageTag,
            Room: null,
            Item: "Shake/Trim",
            Quantity: 1.0,
            UnitOfMeasure: "Ounces",
            IsProductionBatch: false,
            ProductionBatchNumber: null,
            ProductRequiresRemediation: false,
            ActualDate: date,
            Ingredients: [
                {
                    Package: "ABCDEF012345670000014064",
                    Quantity: 1.0,
                    UnitOfMeasure: "Ounces"
                }
            ]
        }
    ]);

    //Change the item
    await Metrc.Package.changeItem(licenseNumber, [
        {
            "Label": packageTag,
            "Item": 'FF Trim Test'
        }
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);


