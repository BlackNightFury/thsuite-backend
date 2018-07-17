'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const plantId = 10130;
    //Change growth phase
    await Metrc.Plant.destroy(licenseNumber, [
        {
            Id: plantId,
            Label: null,
            ReasonNote: "Eval in progress",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);
