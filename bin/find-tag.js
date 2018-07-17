
const Metrc = require("../lib/metrc");

let tags = require('fs').readFileSync('./bin/plant-tags', 'utf8').split("\r\n");

console.log(`Found ${tags.length} tags`);

(async function() {

    for(let tag of tags) {

        let hadError = false;
        try {

            console.log(`Testing tag ${tag}`);

            await Metrc.Plant.create('300-X0002', {
                PlantLabel: tag,
                PlantBatchName: 'Test Create Batch for Plant 2017-05-04',
                PlantBatchType: 'Clone',
                PlantCount: 1,
                StrainName: 'TN Orange Dream',
                ActualDate: '2017-05-04'
            });

        }
        catch(e) {
            console.error(e.error || e);
            hadError = true;
        }

        if(!hadError) {
            break;
        }
    }

    console.log("Done");
})()