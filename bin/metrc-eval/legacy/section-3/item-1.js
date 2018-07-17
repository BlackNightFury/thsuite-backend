'use strict';

const moment = require('moment');

const Metrc = require("../../../lib/metrc/index");


(async function() {

    throw new Error("How can you create a package with more than one item? It seems to be a one to one mapping");


    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '300-X0002';
    const date = moment().format('YYYY-MM-DD');

    const budsName1 = `Test Create Buds ${date} ${random}`;
    const budsName2 = `Test Create Buds ${date} ${random} 2`;

    const packageTag1 = 'ABCDEF012345670000013530';
    const packageTag2 = 'ABCDEF012345670000013531';
    const packageTag3 = 'ABCDEF012345670000013532';

    //Create item in Extract (each) and Buds

    await Metrc.Item.create(licenseNumber, [
        {
            ItemCategory: "Buds",
            Name: budsName1,
            UnitOfMeasure: 'Ounces',
            Strain: 'TN Orange Dream',
            UnitThcContent: null,
            UnitThcContentUnitOfMeasure: null,
            UnitWeight: null,
            UnitWeightUnitOfMeasure: null
        },
        {
            ItemCategory: "Buds",
            Name: budsName2,
            UnitOfMeasure: 'Ounces',
            Strain: 'TN Orange Dream',
            UnitThcContent: null,
            UnitThcContentUnitOfMeasure: null,
            UnitWeight: null,
            UnitWeightUnitOfMeasure: null
        }
    ]);

    await Metrc.Package.create(licenseNumber, [
        {
            Tag: packageTag1,
            Item: budsName1,
            Quantity: 16.0,
            UnitOfMeasure: 'Ounces',
            IsProductionBatch: false,
            ProductionBatchNumber: null,
            ProductRequiresRemediation: false,
            ActualDate: date,
            Ingredients:[]
        },
        {
            Tag: packageTag2,
            Item: budsName2,
            Quantity: 16.0,
            UnitOfMeasure: 'Ounces',
            IsProductionBatch: false,
            ProductionBatchNumber: null,
            ProductRequiresRemediation: false,
            ActualDate: date,
            Ingredients:[]
        }
    ]);


})().catch(err => console.error(err.error || err)).then(process.exit);