'use strict';
//Id: 16201

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function(){

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';
    const batchName = "Metrc KUSH PB 2018-05 X";

    console.log("Changing to flowering");
    await Metrc.PlantBatch.changeGrowthPhase(licenseNumber, [
        {
            Name: batchName,
            Count: 2,
            StartingTag: "1A4FFFC00030D41000004321",
            GrowthPhase: "Flowering",
            NewRoom: "Flower Room ABC-XYZ",
            GrowthDate: date
        }
    ])

})().catch(err => console.error(err.error || err)).then(process.exit);

