'use strict';

const moment = require('moment');

const Metrc = require("../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '300-X0002';
    const date = moment().format('YYYY-MM-DD');

    const itemName = `Test Create For Package ${date} ${random}`;
    const packageTag = '1A4FFFB002DC6C2000000177';

    await Metrc.Item.create(licenseNumber, [
        {
            ItemCategory: "Buds",
            Name: itemName,
            UnitOfMeasure: 'Ounces',
            Strain: 'TN Orange Dream',
            UnitThcContent: null,
            UnitThcContentUnitOfMeasure: null,
            UnitWeight: null,
            UnitWeightUnitOfMeasure: null
        },
    ]);

    let activeItems = await Metrc.Item.listActive(licenseNumber);

    let createdItem = activeItems.find(item => item.Name == itemName);

    if(!createdItem) {
        throw new Error("Could not find created item");
    }

    //Create package with item

    await Metrc.Package.create(licenseNumber, {
        Tag: packageTag,
        Item: itemName,
        Quantity: 16.0,
        UnitOfMeasure: 'Ounces',
        IsProductionBatch: false,
        ProductionBatchNumber: null,
        ProductRequiresRemediation: false,
        ActualDate: date,
        Ingredients: [

        ]
    });

    await Metrc.Item.delete(licenseNumber, createdItem.Id);

    console.log(packageTag);
    console.log(itemName)


})().catch(err => console.error(err.error || err)).then(process.exit);