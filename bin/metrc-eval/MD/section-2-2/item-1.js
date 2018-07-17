'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'G-17-X0001';

    await Metrc.Room.create(licenseNumber, [
        {
            Name: "Flowering Room 5678-WXYZ"
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);

