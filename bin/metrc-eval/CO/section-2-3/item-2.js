'use strict';

//Update room name
const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = '403R-X0001';
    const strainName = "OG Metrc Dream";
    await Metrc.Strain.create(licenseNumber, [
        {
            Name: strainName,
            TestingStatus: "None",
            ThcLevel: 0.345,
            CbdLevel: 0.123,
            IndicaPercentage: 25.0,
            SativaPercentage: 75.0
        }
    ]);

    let strains = await Metrc.Strain.listActive(licenseNumber);

    let createdStrain = strains.find(strain => {
        return strain.Name == strainName;
    });

    console.log(createdStrain);

    await Metrc.Strain.update(licenseNumber, [
        {
            Id: createdStrain.Id,
            Name: createdStrain.Name,
            ThcLevel: 0.0345, //Edited
            CbdLevel: 0.135, //Edited
            IndicaPercentage: createdStrain.IndicaPercentage,
            SativaPercentage: createdStrain.SativaPercentage
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);
