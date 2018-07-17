'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';

    await Metrc.PlantBatch.createPlantings(licenseNumber, [
        {
            Name: "2018-04 OG Metrc Dream",
            Type: "Clone",
            Count: 50,
            Strain: "OG Metrc Dream",
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);

