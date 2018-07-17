'use strict';

//Create new room (from item-1), move plant to room, discontinue room
const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    let date = moment().format("YYYY-MM-DD");

    const licenseNumber = '403R-X0001';
    const roomName = "New Plant Room ABCD-1234";
    const roomId = 10603;

    await Metrc.Plant.move(licenseNumber, [
        {
            Id: null,
            Label: "1A4FFFC303D7E31000000024",
            Room: roomName,
            ActualDate: date
        }
    ]);



    await Metrc.Room.delete(licenseNumber, roomId);



})().catch(err => console.error(err.error || err)).then(process.exit);

