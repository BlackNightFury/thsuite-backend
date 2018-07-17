'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const plantId = 207828;
    //Change growth phase
    await Metrc.Plant.changeGrowthPhase(licenseNumber, [
        {
            Id: plantId,
            Label: null,
            NewTag: "1A4FFFC303D7E31000000587",
            GrowthPhase: "Vegetative",
            NewRoom: "Veg Room ABCD-1234",
            GrowthDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);



