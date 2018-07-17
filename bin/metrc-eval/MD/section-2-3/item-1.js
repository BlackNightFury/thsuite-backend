'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'G-17-X0001';

    await Metrc.Strain.create(licenseNumber, [
        {
            Name: "OG 123",
            TestingStatus: "None",
            ThcLevel: 0.345,
            CbdLevel: 0.123,
            IndicaPercentage: 25.0,
            SativaPercentage: 75.0
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);
