'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = '008-0000010-LIC';

    const date = moment.utc().format();

    await Metrc.LabTest.create(licenseNumber, 	{
        "Label": "1A4FF0300000026000000001",
        "ResultDate": "2018-05-24T21:47:52Z",
        "Results": [
            {
                "LabTestTypeName": "THC (mg/g)",
                "Quantity": 27.85,
                "Passed": true,
                "Notes": ""
            }
        ]
    })



})().catch(err => console.error(err.error || err)).then(process.exit);



