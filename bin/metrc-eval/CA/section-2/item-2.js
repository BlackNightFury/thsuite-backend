'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'CML17-0000001';
    const roomId = 12401;

    await Metrc.Room.update(licenseNumber, [
        {
            Id: roomId,
            Name: "NEW Flower Room ABC-XYZ"
        }
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);



