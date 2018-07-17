'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = '020-X0001';
    const roomId = 34231;

    await Metrc.Room.update(licenseNumber, [
        {
            Id: roomId,
            Name: "NEW Flower Room 123-456"
        }
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);



