'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment.utc().format();
    const licenseNumber = '405R-X0001';

    console.log("Submitting failed results");

    await Metrc.LabTest.create(licenseNumber, {
        Label: "ABCDEF012345670000015141",
        ResultDate: date,
        Results: [
            {
                LabTestTypeName: "Solvents (pass/fail)",
                Quantity: 150,
                Passed: false,
                Notes: ""
            },
            {
                LabTestTypeName: "Butane (pass/fail)",
                Quantity: 200,
                Passed: false,
                Notes: ""
            },
            {
                LabTestTypeName: "Benzene (pass/fail)",
                Quantity: 50,
                Passed: true,
                Notes: ""
            }
        ]
    });

    console.log("Submitting passed results");
    await Metrc.LabTest.create(licenseNumber, {
        Label: "ABCDEF012345670000015141",
        ResultDate: date,
        Results: [
            {
                LabTestTypeName: "Solvents (pass/fail)",
                Quantity: 50,
                Passed: true,
                Notes: ""
            },
            {
                LabTestTypeName: "Butane (pass/fail)",
                Quantity: 50,
                Passed: true,
                Notes: ""
            },
            {
                LabTestTypeName: "Benzene (pass/fail)",
                Quantity: 50,
                Passed: true,
                Notes: ""
            }
        ]
    });



})().catch(err => console.error(err.error || err)).then(process.exit);




