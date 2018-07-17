'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {

    const licenseNumber = 'A12-0000015-LIC';
    const date = moment().format('YYYY-MM-DD');

    const packageTag = '1A4FF0300000029000000001';


    await Metrc.Package.finish(licenseNumber, {
        Label: packageTag,
        ActualDate: date
    })


})().catch(err => console.error(err.error || err)).then(process.exit);
