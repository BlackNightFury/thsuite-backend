'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';

    await Metrc.PlantBatch.createPlantings(licenseNumber, [
        {
            Name: "2018-05 OG 123",
            Type: "Clone",
            Count: 50,
            Strain: "OG 123",
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);

