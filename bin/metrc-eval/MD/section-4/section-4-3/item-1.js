'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    //Move plants to different room
    await Metrc.Plant.move(licenseNumber, [
        {
            Id: 10121,
            Label: null,
            Room: "Veg Room B",
            ActualDate: date
        },
        {
            Id: 10122,
            Label: null,
            Room: "Veg Room B",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);


