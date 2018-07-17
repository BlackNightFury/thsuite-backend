'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'CML17-0000001';
    //Harvest
    await Metrc.Plant.harvest(licenseNumber, [
        {
            Plant: "1A4FF0000000022000000374",
            Weight: 200.23,
            UnitOfWeight: "Grams",
            DryingRoom: "Basement",
            HarvestName: "2018-05 Harvest 374",
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);






