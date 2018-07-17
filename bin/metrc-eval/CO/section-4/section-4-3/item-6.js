'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const plantTag = '1A4FFFC303D7E31000000587';
    //Manicure plants
    await Metrc.Plant.manicure(licenseNumber, [
        {
            Plant: plantTag,
            Weight: 40,
            UnitOfWeight: "Grams",
            DryingRoom: "Drying-Room-123-ABCD",
            HarvestName: "2018-04 ShakeTrim Manicure Harvest",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);

