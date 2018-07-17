'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'L-17-X0001';

    const date = moment.utc().format();

    console.log(date);

    //Was unable to actually run this at time of eval
    await Metrc.LabTest.create(licenseNumber, 	{
        "Label": "ABCDEF012345670000015141",
        "ResultDate": "2018-05-08T21:47:52Z",
        "Results": [
            {
                "LabTestTypeName": "THC (%)",
                "Quantity": 27.85,
                "Passed": true,
                "Notes": "THC % Note!"
            },
            {
                "LabTestTypeName": "E.coli (CFU/g)",
                "Quantity": 50,
                "Passed": true,
                "Notes": "E.coli Note!"
            }
        ]
    })



})().catch(err => console.error(err.error || err)).then(process.exit);



