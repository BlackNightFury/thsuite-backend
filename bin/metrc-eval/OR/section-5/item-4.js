'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';
    //Harvest
    await Metrc.Plant.harvest(licenseNumber, [
        {
            Plant: "1A4FFFC00030D41000004321",
            Weight: 200.23,
            UnitOfWeight: "Grams",
            DryingRoom: "Harvest Room",
            HarvestName: "2018-05 Harvest 4321",
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);






