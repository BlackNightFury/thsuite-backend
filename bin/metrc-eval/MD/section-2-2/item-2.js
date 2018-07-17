'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'G-17-X0001';
    const roomId = 2202;

    await Metrc.Room.update(licenseNumber, [
        {
            Id: roomId,
            Name: "Drying-Room-456-789-ABC-XYZ"
        }
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);


