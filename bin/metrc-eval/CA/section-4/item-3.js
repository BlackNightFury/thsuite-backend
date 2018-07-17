'use strict';
//Id: 16201

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function(){

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'CML17-0000001';
    const batchId = 16301;

    await Metrc.PlantBatch.destroy(licenseNumber, [
        {
            Id: batchId,
            Count: 1,
            ReasonNote: "Evaluation in progress",
            ActualDate: date
        }
    ])

})().catch(err => console.error(err.error || err)).then(process.exit);


