'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const plantId = 207822;
    //Change growth phase
    console.log(`Moving plant ${plantId} to Flowering with tag 1A4FFFC303D7E31000000593`);
    await Metrc.Plant.changeGrowthPhase(licenseNumber, [
        {
            Id: plantId,
            Label: null,
            NewTag: "1A4FFFC303D7E31000000593",
            GrowthPhase: "Flowering",
            NewRoom: "Flowering Room 5678-WXYZ",
            GrowthDate: date
        }
    ]);
    console.log(`Changing plant tag to 1A4FFFC303D7E31000000594`);
    await Metrc.Plant.changeGrowthPhase(licenseNumber, [
        {
            Id: plantId,
            Label: "1A4FFFC303D7E31000000593",
            NewTag: "1A4FFFC303D7E31000000594",
            GrowthPhase: "Flowering",
            NewRoom: "Flowering Room 5678-WXYZ",
            GrowthDate: date
        }
    ])


})().catch(err => console.error(err.error || err)).then(process.exit);




