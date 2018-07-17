'use strict';

//Create a new room
const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = '403R-X0001';

    await Metrc.Room.create(licenseNumber, [
        {
            Name: "Flowering Room 5678-WXYZ"
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);