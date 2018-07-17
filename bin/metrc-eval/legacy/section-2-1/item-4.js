'use strict';


const Metrc = require("../../../lib/metrc/index");


(async function() {

    const licenseNumber = '300-X0002';

    let activeItems = await Metrc.Item.listActive(licenseNumber);


    let firstItem = await Metrc.Item.get(activeItems[0].Id);

    let secondItem = await Metrc.Item.get(activeItems[1].Id);


    console.log(firstItem.Name);
    console.log(secondItem.Name);


})().catch(err => console.error(err.error || err)).then(process.exit);