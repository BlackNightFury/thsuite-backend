'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {

    const licenseNumber = '050-X0002';
    const date = moment().format('YYYY-MM-DD');

    const packageTag = '1A4FFFB0007A122000003431';


    await Metrc.Package.finish(licenseNumber, {
        Label: packageTag,
        ActualDate: date
    })


})().catch(err => console.error(err.error || err)).then(process.exit);
