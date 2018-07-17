'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const plantId = 10129;
    //Change growth phase
    console.log(`Moving plant ${plantId} to Flowering with tag ABCDEF012345670000013732`);
    await Metrc.Plant.changeGrowthPhase(licenseNumber, [
        {
            Id: plantId,
            Label: null,
            NewTag: "ABCDEF012345670000013732",
            GrowthPhase: "Flowering",
            NewRoom: "Flower Room A",
            GrowthDate: date
        }
    ]);
    console.log(`Changing plant tag to ABCDEF012345670000013733`);
    await Metrc.Plant.changeGrowthPhase(licenseNumber, [
        {
            Id: plantId,
            Label: "ABCDEF012345670000013732",
            NewTag: "ABCDEF012345670000013733",
            GrowthPhase: "Flowering",
            NewRoom: "Flower Room A",
            GrowthDate: date
        }
    ])


})().catch(err => console.error(err.error || err)).then(process.exit);




