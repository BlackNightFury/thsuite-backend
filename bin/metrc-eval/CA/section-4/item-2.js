'use strict';
//Id: 16201

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function(){

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'CML17-0000001';
    const batchId = 16301;

    console.log("Changing to flowering");
    await Metrc.PlantBatch.changeGrowthPhase(licenseNumber, [
        {
            Id: batchId,
            Count: 2,
            StartingTag: "1A4FF0000000022000000374",
            GrowthPhase: "Flowering",
            NewRoom: "Flower Room ABC",
            GrowthDate: date
        }
    ])

})().catch(err => console.error(err.error || err)).then(process.exit);

