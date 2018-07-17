'use strict';

const moment = require('moment');
const Bluebird = require('bluebird');
const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = 'A12-0000015-LIC';
    const date = moment().format('YYYY-MM-DD');

    const datetime = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

    console.log(datetime);

    await Metrc.Sale.createReceipt(licenseNumber, [
        {
            SalesDateTime: datetime,
            SalesCustomerType: "Consumer",
            PatientLicenseNumber: null,
            CaregiverLicenseNumber: null,
            Transactions: [
                {
                    PackageLabel: "1A4FF0300000029000000002",
                    Quantity: 1.0,
                    UnitOfMeasure: "Each",
                    TotalAmount: 9.99
                }
            ]
        }
    ]);

    let receipts = await Metrc.Sale.listReceipts(licenseNumber);

    let createdReceipt = receipts.find(receipt => {
        return moment(datetime).diff(moment(receipt.SalesDateTime), 'milliseconds') <= 5;
    });

    if(!createdReceipt) {
        throw new Error("Could not find created receipt");
    }

    console.log(`Deleting receipt with ID ${createdReceipt.Id}`);

    await Metrc.Sale.deleteReceipt(licenseNumber, createdReceipt.Id);

})().catch(err => console.error(err.error || err)).then(process.exit);



