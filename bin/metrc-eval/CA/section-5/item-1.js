'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'CML17-0000001';
    //Move plants to different room
    await Metrc.Plant.move(licenseNumber, [
        {
            Id: 32401,
            Label: "1A4FF0000000022000000374",
            Room: "NEW Flower Room ABC-XYZ",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);



