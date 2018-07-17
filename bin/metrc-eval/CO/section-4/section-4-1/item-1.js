'use strict';


const moment = require('moment');

const Metrc = require("../../../../../lib/metrc/index");

(async function() {

    const date = moment().format("YYYY-MM-DD");
    const licenseNumber = '403R-X0001';
    const harvestId = 8401;
    await Metrc.Harvest.createPackages(licenseNumber, [
        {
            Harvest: harvestId,
            Room: null,
            Item: "Buds Item",
            Weight: 50,
            UnitOfWeight: "Grams",
            Tag: "1A4FFFB303D7E31000000219",
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
            Item: "Buds Item",
            Weight: 50,
            UnitOfWeight: "Grams",
            Tag: "1A4FFFB303D7E31000000220",
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
