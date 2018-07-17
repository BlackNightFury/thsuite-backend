'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = '';

    const date = moment.utc().format();

    await Metrc.LabTest.create(licenseNumber, 	{
        "Label": "ABCDEF012345670000015611",
        "ResultDate": "2018-05-25T21:47:52Z",
        "Results": [
            {
                "LabTestTypeName": "THC (%RSD)",
                "Quantity": 27.85,
                "Passed": true,
                "Notes": ""
            }
        ]
    })



})().catch(err => console.error(err.error || err)).then(process.exit);




