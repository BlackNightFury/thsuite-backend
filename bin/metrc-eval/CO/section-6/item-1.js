'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment.utc().format();
    const licenseNumber = '405R-X0001';

    await Metrc.LabTest.create(licenseNumber, 	{
        "Label": "ABCDEF012345670000016491",
        "ResultDate": "2018-05-01T21:46:32Z",
        "Results": [
            {
                "LabTestTypeName": "Potency (pass/fail)",
                "Quantity": 50,
                "Passed": true,
                "Notes": "Potency note here!"
            },
            {
                "LabTestTypeName": "THC",
                "Quantity": 100,
                "Passed": true,
                "Notes": ""
            },
            {
                "LabTestTypeName": "CBD",
                "Quantity": 50,
                "Passed": true,
                "Notes": ""
            },
            {
                "LabTestTypeName": "THCa",
                "Quantity": 50,
                "Passed": true,
                "Notes": ""
            },
            {
                "LabTestTypeName": "CBN",
                "Quantity": 50,
                "Passed": true,
                "Notes": ""
            },
            {
                "LabTestTypeName": "CBDa",
                "Quantity": 50,
                "Passed": true,
                "Notes": ""
            }
        ]
    })



})().catch(err => console.error(err.error || err)).then(process.exit);



