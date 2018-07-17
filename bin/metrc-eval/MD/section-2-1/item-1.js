'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'G-17-X0001';

    let name = "BUDS - OG 123";

    await Metrc.Item.create(licenseNumber, [
        {
            "ItemCategory": "Buds",
            "Name": name,
            "UnitOfMeasure": "Grams",
            "AdministrationMethod": null,
            "Strain": "OG 123",
            "UnitCbdPercent": null,
            "UnitCbdContent": null,
            "UnitCbdContentUnitOfMeasure": null,
            "UnitThcPercent": null,
            "UnitThcContent": 10.0,
            "UnitThcContentUnitOfMeasure": "Milligrams",
            "UnitVolume": null,
            "UnitVolumeOfMeasure": null,
            "UnitWeight": 10.0,
            "UnitWeightUnitOfMeasure": "Grams",
            "ServingSize": null,
            "SupplyDurationDays": null,
            "Ingredients": null
        }
    ]);

    await Metrc.Item.create(licenseNumber, [
        {
            "ItemCategory": "Seeds",
            "Name": "SEEDS - OG 123",
            "UnitOfMeasure": "Each",
            "AdministrationMethod": null,
            "Strain": "OG 123",
            "UnitCbdPercent": null,
            "UnitCbdContent": null,
            "UnitCbdContentUnitOfMeasure": null,
            "UnitThcPercent": null,
            "UnitThcContent": null,
            "UnitThcContentUnitOfMeasure": null,
            "UnitVolume": null,
            "UnitVolumeOfMeasure": null,
            "UnitWeight": null,
            "UnitWeightUnitOfMeasure": null,
            "ServingSize": null,
            "SupplyDurationDays": null,
            "Ingredients": null
        }
    ]);



})().catch(err => console.error(err.error || err)).then(process.exit);
