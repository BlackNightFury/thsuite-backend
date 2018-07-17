'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = 'A12-0000015-LIC';
    const date = moment().format('YYYY-MM-DD');

    const name = `Test Create ${date} ${random}`;

    console.log(`Creating item with name: ${name}`);

    await Metrc.Item.create(licenseNumber, [
        {
            ItemCategory: "Flower",
            Name: name,
            UnitOfMeasure: 'Grams',
            Strain: 'Blue Dream',
            UnitThcContent: null,
            UnitThcContentUnitOfMeasure: null,
            UnitVolume: null,
            UnitVolumeOfMeasure: null,
            UnitWeight: null,
            UnitWeightUnitOfMeasure: null
        },
    ]);

    let activeItems = await Metrc.Item.listActive(licenseNumber);

    let createdItem = activeItems.find(item => item.Name == name);

    if(!createdItem) {
        throw new Error("Could not find created item");
    }

    console.log(createdItem);


})().catch(err => console.error(err.error || err)).then(process.exit);
