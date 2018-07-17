'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {



    const licenseNumber = '402R-00343';
    const date = moment().format('YYYY-MM-DD');


    await Metrc.Transaction.create(licenseNumber, date, [
        {
            PackageLabel: '1A400031266EFC4000000346',
            Quantity: 1.0,
            UnitOfMeasure: 'Grams',
            TotalAmount: 20.0
        },
    ]);

    await Metrc.Transaction.create(licenseNumber, date, [
        {
            PackageLabel: '1A400031266EFC4000000346',
            Quantity: 1.0,
            UnitOfMeasure: 'Grams',
            TotalAmount: 20.0
        },
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);