const BabyParse = require('babyparse');
const fs = require('fs');
const path = require('path');
const Metrc = require('../../lib/metrc');
const moment = require('moment');
const {Package} = require('../../models');

(async function(){

    let license = "402R-00343";

    //TODO: If using this again, get a new file, these have already been adjusted
    let filename = false;
    // let filename = "co-grow-negative-packages.csv";

    if(!filename){
        console.log(`No valid file to process. Exiting...`);
        process.exit(0);
    }

    let parsed = BabyParse.parseFiles(path.join(__dirname, filename), {
        header: true
    });

    let rows = parsed.data;

    for(let row of rows){
        let tag = row.Tag;

        if(!tag) continue;

        console.log(`Now processing package ${tag}`);
        if(row.Category == "Buds" || row.Category == "Shake/Trim"){
            console.log(`   Package ${tag} is a bud or shake/trim package. Skipping...`);
            continue;
        }

        //Double check
        if(row.Quantity > 0){
            console.log(`   Package ${tag} has positive quantity. Skipping...`);
        }

        let adjustmentAmount = row.Quantity * -1;

        console.log(`   Package ${tag} needs to be adjusted by ${adjustmentAmount}`);

        const _package = await Package.findOne({
            where: {
                Label: tag
            }
        });

        if(!_package){
            console.log(`   Unable to find package ${tag} in the database!`);
            continue;
        }else{
            console.log(`   Found package with UnitOfMeasure ${_package.UnitOfMeasureName}`);
        }

        let adjustment = {
            Label: tag,
            Quantity: adjustmentAmount,
            UnitOfMeasure: _package.UnitOfMeasureName,
            AdjustmentReason: "API Adjustment Error",
            AdjustmentDate: moment().format("YYYY-MM-DD"),
            ReasonNote: "THSuite adjusting packages inadvertently overdrawn by system"

        };

        console.log(`   Making adjustment in Metrc...`);
        try{
            await Metrc.Package.adjust(license, adjustment);
            console.log(`   Successfully adjusted ${tag} in Metrc!`);
        }catch(e){
            console.log(`   Error submitting to Metrc...`);
            console.log(e.message);
        }

    }

})();
