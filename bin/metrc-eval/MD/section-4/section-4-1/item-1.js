'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = 'G-17-X0001';
    const harvestId = 5401;
    await Metrc.Harvest.createPackages(licenseNumber, [
        {
            Harvest: harvestId,
            Room: null,
            Item: "BUDS - OG 123",
            Weight: 50,
            UnitOfWeight: "Grams",
            Tag: "ABCDEF012345670000013898",
            IsProductionBatch: false,
            ProductionBatchNumber: null,
            ProductRequiresRemediation: false,
            RemediateProduct: false,
            RemediationMethod: null,
            RemediationDate: null,
            RemediationSteps: null,
            ActualDate: date
        },
        {
            Harvest: harvestId,
            Room: null,
            Item: "BUDS - OG 123",
            Weight: 50,
            UnitOfWeight: "Grams",
            Tag: "ABCDEF012345670000013899",
            IsProductionBatch: false,
            ProductionBatchNumber: null,
            ProductRequiresRemediation: false,
            RemediateProduct: false,
            RemediationMethod: null,
            RemediationDate: null,
            RemediationSteps: null,
            ActualDate: date
        },
    ])



})().catch(err => console.error(err.error || err)).then(process.exit);
