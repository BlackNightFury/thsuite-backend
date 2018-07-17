'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';
    //Move plants to different room
    await Metrc.Plant.move(licenseNumber, [
        {
            Id: 101462,
            Label: "1A4FFFC00030D41000004321",
            Room: "NEW Flower Room 123-456",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);



