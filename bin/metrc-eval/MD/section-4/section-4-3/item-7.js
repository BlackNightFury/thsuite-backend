'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    //Harvest plants
    await Metrc.Plant.harvest(licenseNumber, [
        {
            Plant: "ABCDEF012345670000013594",
            Weight: 5,
            UnitOfWeight: "Ounces",
            DryingRoom: "Drying-Room-456-789-ABC-XYZ",
            HarvestName: "2018-05 Flowering Harvest",
            ActualDate: date
        },
        {
            Plant: "ABCDEF012345670000013596",
            Weight: 5,
            UnitOfWeight: "Ounces",
            DryingRoom: "Drying-Room-456-789-ABC-XYZ",
            HarvestName: "2018-05 Flowering Harvest",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);