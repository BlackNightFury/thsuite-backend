'use strict';

const moment = require('moment');

const Metrc = require("../../../lib/metrc/index");


(async function() {

    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '300-X0002';
    const date = moment().format('YYYY-MM-DD');

    const extractName = `Test Create Extract (each) ${date} ${random}`;
    const budsName = `Test Create Buds ${date} ${random}`;

    //Create item in Extract (each) and Buds

    await Metrc.Item.create(licenseNumber, [
        {
            ItemCategory: "Extracts (each)",
            Name: extractName,
            UnitOfMeasure: 'Each',
            Strain: 'TN Orange Dream',
            UnitThcContent: null,
            UnitThcContentUnitOfMeasure: null,
            UnitWeight: 1,
            UnitWeightUnitOfMeasure: 'Grams'
        },
        {
            ItemCategory: "Buds",
            Name: budsName,
            UnitOfMeasure: 'Ounces',
            Strain: 'TN Orange Dream',
            UnitThcContent: null,
            UnitThcContentUnitOfMeasure: null,
            UnitWeight: null,
            UnitWeightUnitOfMeasure: null
        }
    ]);


    console.log(extractName);
    console.log(budsName);

})().catch(err => console.error(err.error || err)).then(process.exit);