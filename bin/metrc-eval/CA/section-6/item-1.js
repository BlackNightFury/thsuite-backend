'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'CML17-0000001';
    //Move plants to different room
    await Metrc.Harvest.createPackages(licenseNumber, [
        {
            Harvest: 9104,
            Room: null,
            Item: "Metrc KUSH Buds",
            Weight: 80.23,
            UnitOfWeight: "Grams",
            Tag: "1A4FF0100000022000000282",
            IsProductionBatch: false,
            ProductionBatchNumber: null,
            ProductRequiresRemediation: false,
            RemediateProduct: false,
            RemediationMethodId: null,
            RemediationDate: null,
            RemediationSteps: null,
            ActualDate: date
        }
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);




