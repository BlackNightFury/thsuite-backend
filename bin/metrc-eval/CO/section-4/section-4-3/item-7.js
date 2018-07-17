'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    //Harvest plants
    await Metrc.Plant.harvest(licenseNumber, [
        {
            Plant: "1A4FFFC303D7E31000000588",
            Weight: 5,
            UnitOfWeight: "Ounces",
            DryingRoom: "Drying-Room-123-ABCD",
            HarvestName: "2018-04 Flowering Harvest",
            ActualDate: date
        },
        {
            Plant: "1A4FFFC303D7E31000000589",
            Weight: 5,
            UnitOfWeight: "Ounces",
            DryingRoom: "Drying-Room-123-ABCD",
            HarvestName: "2018-04 Flowering Harvest",
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);