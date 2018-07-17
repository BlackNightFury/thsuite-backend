'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const plantTag = 'ABCDEF012345670000013598';
    //Manicure plants
    await Metrc.Plant.manicure(licenseNumber, [
        {
            Plant: plantTag,
            Weight: 40,
            UnitOfWeight: "Grams",
            DryingRoom: "Drying-Room-456-789-ABC-XYZ",
            HarvestName: "2018-05 ShakeTrim Manicure Harvest",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);

