'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const plantId = 10123;
    //Change growth phase
    await Metrc.Plant.changeGrowthPhase(licenseNumber, [
        {
            Id: plantId,
            Label: null,
            NewTag: "ABCDEF012345670000013598",
            GrowthPhase: "Vegetative",
            NewRoom: "Veg Room A",
            GrowthDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);



