'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const plantIds = [207827, 207826, 207825, 207824, 207823];
    const plantTags = ["1A4FFFC303D7E31000000588", "1A4FFFC303D7E31000000589", "1A4FFFC303D7E31000000590", "1A4FFFC303D7E31000000591", "1A4FFFC303D7E31000000592"];
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
            NewRoom: "Flowering Room 5678-WXYZ",
            GrowthDate: date
        });

    }

    console.log(metrcData);

    await Metrc.Plant.changeGrowthPhase(licenseNumber,metrcData);



})().catch(err => console.error(err.error || err)).then(process.exit);




