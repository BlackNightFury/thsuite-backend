'use strict';

const moment = require("moment");

const Metrc = require("../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '300-X0002';
    const date = moment().format('YYYY-MM-DD');

    const roomName = `Test Create Room For Plant ${date} ${random}`;
    const plantBatchName = `Test Create Batch for Plant ${date} ${random}`;
    const plantLabel = 'ABCDEF012345670000013261';

    await Metrc.Room.create(licenseNumber, {
        Name: roomName
    });



    await Metrc.PlantBatch.createPlantings(licenseNumber, {
        Name: plantBatchName,
        Type: "Clone",
        Count: 1,
        Strain: 'TN Orange Dream',
        ActualDate: date
    });


    await Metrc.Plant.create(licenseNumber, {
        PlantLabel: plantLabel,
        PlantBatchName: plantBatchName,
        PlantBatchType: 'Clone',
        PlantCount: 1,
        StrainName: 'TN Orange Dream',
        ActualDate: date
    });


    await Metrc.Plant.move(licenseNumber, {
        Id: null,
        Label: plantLabel,
        Room: roomName,
        ActualDate: date
    });


    let activeRooms = await Metrc.Room.listActive(licenseNumber);

    let createdRoom = activeRooms.find(room => room.Name == roomName);

    if(!createdRoom) {
        throw new Error("Could not find created room");
    }

    await Metrc.Room.delete(licenseNumber, createdRoom.Id);

    console.log(plantLabel);
    console.log(roomName);

})().catch(err => console.error(err.error || err)).then(process.exit);