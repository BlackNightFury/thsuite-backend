'use strict';

//Create new room (from item-1), move plant to room, discontinue room
const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    let date = moment().format("YYYY-MM-DD");

    const licenseNumber = '403R-X0001';
    const strainName = "Super Kush OG";
    await Metrc.Strain.create(licenseNumber, [
        {
            Name: strainName,
            TestingStatus: "None",
            ThcLevel: 0.445,
            CbdLevel: 0.223,
            IndicaPercentage: 10.0,
            SativaPercentage: 90.0
        }
    ]);

    let strains = await Metrc.Strain.listActive(licenseNumber);

    let createdStrain = strains.find(strain => {
        return strain.Name == strainName;
    });

    console.log(createdStrain);

    //Create plant batch using this strain

    await Metrc.PlantBatch.createPlantings(licenseNumber, [
        {
            Name: "Super Kush OG PB",
            Type: "Clone",
            Count: 50,
            Strain: createdStrain.Name,
            ActualDate: date
        }
    ]);

    console.log("Plant batch created");

    //Delete Strain

    await Metrc.Strain.delete(licenseNumber, createdStrain.Id);

    console.log("Strain deleted");


})().catch(err => console.error(err.error || err)).then(process.exit);

