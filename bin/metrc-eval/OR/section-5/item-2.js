'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';
    //Destroy
    await Metrc.Plant.destroy(licenseNumber, [
        {
            Id: 101463,
            Label: "1A4FFFC00030D41000004322",
            ReasonNote: "Plant died",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);




