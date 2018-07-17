'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = '020-X0001';

    await Metrc.Room.create(licenseNumber, [
        {
            Name: "Flower Room ABC-XYZ"
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);


