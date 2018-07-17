'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '050-X0002';
    const date = moment().subtract(1, 'days').format('YYYY-MM-DD');

    //Unable to complete, endpoint responds with 401
    await Metrc.Transaction.create(licenseNumber, date, [
        {
            PackageLabel: "1A4FFFB0007A122000003431",
            Quantity: 1.0,
            UnitOfMeasure: "Ounces",
            TotalAmount: 100.00
        },
        {
            PackageLabel: "1A4FFFB0007A122000003431",
            Quantity: 1.0,
            UnitOfMeasure: "Ounces",
            TotalAmount: 100.00
        }
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);


