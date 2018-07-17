'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const harvestId = 8401;
    await Metrc.Harvest.removeWaste(licenseNumber, [
        {
            Id: harvestId,
            UnitOfWeight: "Ounces",
            WasteWeight: 3,
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);

