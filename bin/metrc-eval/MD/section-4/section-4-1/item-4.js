'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const harvestId = 5401;
    await Metrc.Harvest.unfinish(licenseNumber, [
        {
            Id: harvestId
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);


