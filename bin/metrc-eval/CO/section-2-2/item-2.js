'use strict';

//Update room name
const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = '403R-X0001';
    const roomId = 10602;

    await Metrc.Room.update(licenseNumber, [
        {
            Id: roomId,
            Name: "Drying-Room-456-789-ABC-XYZ"
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);
