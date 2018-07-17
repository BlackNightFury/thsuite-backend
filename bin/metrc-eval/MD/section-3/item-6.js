'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {

    const licenseNumber = '402R-00343';
    const date = moment().format('YYYY-MM-DD');

    const packageTag = '1A40003126874A7000000575';


    await Metrc.Package.finish(licenseNumber, {
        Label: packageTag,
        ActualDate: date
    })


})().catch(err => console.error(err.error || err)).then(process.exit);