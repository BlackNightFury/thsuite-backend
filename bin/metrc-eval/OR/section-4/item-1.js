'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';

    await Metrc.PlantBatch.createPlantings(licenseNumber, [
        {
            Name: "Metrc KUSH PB 2018-05 X",
            Type: "Clone",
            Count: 3,
            Strain: "Metrc KUSH",
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);


