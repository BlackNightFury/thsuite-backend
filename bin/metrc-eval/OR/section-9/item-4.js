'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '050-X0002';
    const date = moment().format();

    await Metrc.Sale.putDelivery(licenseNumber, [
        {
            Id: "0000000951",
            SalesDateTime: "2018-05-25T18:00:04.000",
            SalesCustomerType: "Patient",
            PatientLicenseNumber: "123-456-789",
            DriverName: "John Doe",
            DriverOccupationalLicenseNumber: "1",
            DriverVehicleLicenseNumber: "1",
            PhoneNumberForQuestions: "+1-123-456-7890",
            VehicleMake: "Car",
            VehicleModel: "Small",
            VehicleLicensePlateNumber: "000000",
            RecipientAddressStreet1: "1 Someplace Road",
            RecipientAddressStreet2: "Ste 9",
            RecipientAddressCity: "Denver",
            RecipientAddressState: "CO",
            RecipientAddressPostalCode: "11111",
            PlannedRoute: "Drive from point A to point B",
            EstimatedDepartureDateTime: "2018-05-25T11:00:00.000",
            EstimatedArrivalDateTime: "2018-05-25T13:00:00.000",
            Transactions: [
                {
                    PackageLabel: "1A4FFFB0007A122000003431",
                    Quantity: 1.0,
                    UnitOfMeasure: "Ounces",
                    TotalAmount: 100.00
                },
                {
                    PackageLabel: "1A4FFFB0007A122000003474",
                    Quantity: 1.0,
                    UnitOfMeasure: "Ounces",
                    TotalAmount: 100.00
                }
            ]
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);




