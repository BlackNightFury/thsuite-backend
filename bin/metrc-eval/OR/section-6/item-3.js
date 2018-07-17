'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';
    const harvestId = 28902;
    await Metrc.Harvest.finish(licenseNumber, [
        {
            Id: harvestId,
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);



