'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const plantIds = [10124, 10125, 10126, 10127, 10128];
    const plantTags = ["ABCDEF012345670000013764", "ABCDEF012345670000013594", "ABCDEF012345670000013731", "ABCDEF012345670000013596", "ABCDEF012345670000013597"];
    //Change growth phase

    let metrcData = [];

    for(let i in plantIds){

        let plantId = plantIds[i];
        let plantTag = plantTags[i];

        metrcData.push({
            Id: plantId,
            Label: null,
            NewTag: plantTag,
            GrowthPhase: "Flowering",
            NewRoom: "Flower Room A",
            GrowthDate: date
        });

    }

    console.log(metrcData);

    await Metrc.Plant.changeGrowthPhase(licenseNumber,metrcData);



})().catch(err => console.error(err.error || err)).then(process.exit);




