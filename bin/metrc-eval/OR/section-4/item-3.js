'use strict';
//Id: 16201

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function(){

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';
    const batchName = "Metrc KUSH PB 2018-05 X";

    await Metrc.PlantBatch.destroy(licenseNumber, [
        {
            PlantBatch: batchName,
            Count: 1,
            ReasonNote: "Evaluation in progress",
            ActualDate: date
        }
    ])

})().catch(err => console.error(err.error || err)).then(process.exit);


