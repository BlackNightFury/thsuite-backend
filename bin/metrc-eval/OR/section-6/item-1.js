'use strict';


const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '020-X0001';
    //Move plants to different room
    await Metrc.Harvest.createPackages(licenseNumber, [
        {
            Harvest: 28902,
            Room: null,
            Item: "Metrc KUSH Buds",
            Weight: 80.23,
            UnitOfWeight: "Grams",
            Tag: "1A4FFFB00030D41000004245",
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




