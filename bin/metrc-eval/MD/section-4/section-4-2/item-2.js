'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const plantBatchId = 5001;
    await Metrc.PlantBatch.createPackages(licenseNumber, [
        {
            Id: plantBatchId,
            Room: null,
            Item: "MD Plants GSC",
            Tag: "ABCDEF012345670000013909",
            Count: 10,
            ActualDate: date
        },
        {
            Id: plantBatchId,
            Room: null,
            Item: "MS Seeds",
            Tag: "ABCDEF012345670000013910",
            Count: 10,
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);


