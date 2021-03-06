'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const plantBatchId = 15001;
    await Metrc.PlantBatch.destroy(licenseNumber,[
        {
            Id: plantBatchId,
            Count: 10,
            ReasonNote: "Eval in progress",
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);




