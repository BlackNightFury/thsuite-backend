'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'G-17-X0001';

    const name = `BUDS - Ounces`;

    // await Metrc.Item.create(licenseNumber, [
    //     {
    //         ItemCategory: "Buds",
    //         Name: name,
    //         UnitOfMeasure: 'Grams',
    //         Strain: 'OG 123',
    //         "UnitCbdPercent": null,
    //         "UnitCbdContent": null,
    //         "UnitCbdContentUnitOfMeasure": null,
    //         "UnitThcPercent": null,
    //         "UnitThcContent": 10.0,
    //         "UnitThcContentUnitOfMeasure": "Milligrams",
    //         "UnitVolume": null,
    //         "UnitVolumeOfMeasure": null,
    //         "UnitWeight": 10.0,
    //         "UnitWeightUnitOfMeasure": "Grams",
    //         "ServingSize": null,
    //         "SupplyDurationDays": null,
    //         "Ingredients": null
    //     },
    // ]);

    let activeItems = await Metrc.Item.listActive(licenseNumber);

    let createdItem = activeItems.find(item => item.Name == name);

    if(!createdItem) {
        throw new Error("Could not find created item");
    }

    //Update item unit of measure

    await Metrc.Item.update(licenseNumber, [
        {
            Id: createdItem.Id,
            ItemCategory: "Buds",
            Name: name,
            UnitOfMeasure: 'Ounces',
            Strain: 'Blue Dream',
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
        },
    ]);

    console.log(name);


})().catch(err => console.error(err.error || err)).then(process.exit);

