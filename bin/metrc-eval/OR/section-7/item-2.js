'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '050-X0002';
    const date = moment().format('YYYY-MM-DD');

    const name = `Test Create For Update ${date} ${random}`;

    await Metrc.Item.create(licenseNumber, [
        {
            ItemCategory: "Buds",
            Name: name,
            UnitOfMeasure: 'Grams',
            Strain: '24k Silver',
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

    //Update item unit of measure

    await Metrc.Item.update(licenseNumber, [
        {
            Id: createdItem.Id,
            ItemCategory: "Buds",
            Name: name,
            UnitOfMeasure: 'Ounces',
            Strain: '24k Silver',
            UnitThcContent: null,
            UnitThcContentUnitOfMeasure: null,
            UnitVolume: null,
            UnitVolumeOfMeasure: null,
            UnitWeight: null,
            UnitWeightUnitOfMeasure: null
        },
    ]);

    console.log(name);

})().catch(err => console.error(err.error || err)).then(process.exit);
