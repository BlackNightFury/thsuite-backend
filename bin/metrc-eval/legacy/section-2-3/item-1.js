'use strict';

const moment = require('moment');

const Metrc = require("../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '300-X0002';
    const date = moment().format('YYYY-MM-DD');

    let strainName = `Test Create Strain ${date} ${random}`;

    await Metrc.Strain.create(licenseNumber, {
        Name: strainName,
        TestingStatus: "None",
        ThcLevel: 0.1865,
        CbdLevel: 0.1075,
        IndicaPercentage: 25.0,
        SativaPercentage: 75.0
    });

    console.log(strainName);

})().catch(err => console.error(err.error || err)).then(process.exit);