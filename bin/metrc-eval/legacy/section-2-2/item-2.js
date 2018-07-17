'use strict';

const moment = require('moment');

const Metrc = require("../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '300-X0002';
    const date = moment().format('YYYY-MM-DD');

    const roomName = `Test Update Name ${date} ${random}`;

    let activeRooms = await Metrc.Room.listActive(licenseNumber);

    let changeRoom = activeRooms[0];
    changeRoom.Name = roomName;

    await Metrc.Room.update(licenseNumber, changeRoom);


    console.log(roomName);

})().catch(err => console.error(err.error || err)).then(process.exit);