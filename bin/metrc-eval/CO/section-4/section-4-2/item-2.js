'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const plantBatchId = 15001;
    await Metrc.PlantBatch.createPackages(licenseNumber, [
        {
            Id: plantBatchId,
            Room: null,
            Item: "Immature Plants",
            Tag: "1A4FFFB303D7E31000000691",
            Count: 10,
            ActualDate: date
        },
        {
            Id: plantBatchId,
            Room: null,
            Item: "Seeds",
            Tag: "1A4FFFB303D7E31000000692",
            Count: 10,
            ActualDate: date
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);


