'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const plantBatchId = 5001;
    await Metrc.PlantBatch.changeGrowthPhase(licenseNumber, [
        {
            Name: "2018-05 OG 123",
            Count: 10,
            StartingTag: "ABCDEF012345670000013678",
            GrowthPhase: "Vegetative",
            NewRoom: "Veg Room A",
            GrowthDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);



