'use strict';

const moment = require('moment');

const Metrc = require("../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '300-X0002';
    const date = moment().format('YYYY-MM-DD');

    const roomName = `Test Create Room ${date} ${random}`;

    await Metrc.Room.create(licenseNumber, {
        Name: roomName
    });

    console.log(roomName);

})().catch(err => console.error(err.error || err)).then(process.exit);