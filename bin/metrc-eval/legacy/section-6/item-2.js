'use strict';

const moment = require('moment');

const Metrc = require("../../../lib/metrc/index");


(async function() {



    const licenseNumber = '300-X0002';
    const datetime = moment().toISOString();

    await Metrc.LabTest.create(licenseNumber, {
        ResultDate: datetime,
        Label: 'ABCDEF012345670000013530',
        Results: [
            {
                LabTestTypeName: 'Solvents (pass/fail)',
                Quantity: 0,
                Passed: false,
                Notes: ''
            }
        ]
    });

    await Metrc.LabTest.create(licenseNumber, {
        ResultDate: datetime,
        Label: 'ABCDEF012345670000013530',
        Results: [
            {
                LabTestTypeName: 'Solvents (pass/fail)',
                Quantity: 0,
                Passed: true,
                Notes: ''
            }
        ]
    });


})().catch(err => console.error(err.error || err)).then(process.exit);