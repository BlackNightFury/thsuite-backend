'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    //Move plants to different room
    await Metrc.Plant.move(licenseNumber, [
        {
            Id: 207829,
            Label: null,
            Room: "Veg Room 5678-WXYZ",
            ActualDate: date
        },
        {
            Id: 207830,
            Label: null,
            Room: "Veg Room 5678-WXYZ",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);


