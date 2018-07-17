'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {

    const licenseNumber = 'A12-0000015-LIC';
    const date = moment().format('YYYY-MM-DD');

    const packageTag = '1A4FF0300000029000000002';


    await Metrc.Package.adjust(licenseNumber, {
        Label: packageTag,
        Quantity: -1.0,
        UnitOfMeasure: 'Each',
        AdjustmentReason: 'Theft',
        AdjustmentDate: date,
        ReasonNote: 'We had a break in last night'
    })


})().catch(err => console.error(err.error || err)).then(process.exit);
