'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'CML17-0000001';
    //Destroy
    await Metrc.Plant.destroy(licenseNumber, [
        {
            Id: 32402,
            Label: "1A4FF0000000022000000375",
            ReasonNote: "Plant died",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);




