'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '050-X0002';
    const date = moment().format();

    await Metrc.Sale.completeDelivery(licenseNumber, [
        {
            Id: "0000000951",
            ActualArrivalDateTime: "2018-05-25T13:01:00.000",
            AcceptedPackages: [
                "1A4FFFB0007A122000003431"
            ],
            ReturnedPackages: [
                {
                    Label: "1A4FFFB0007A122000003474",
                    ReturnQuantityVerified: 1.0,
                    ReturnUnitOfMeasure: "Ounces",
                    ReturnReason: "Spoilage",
                    ReturnReasonNote: "Note"
                }
            ]
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);





