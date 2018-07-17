'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");

(async function() {

    const licenseNumber = 'G-17-X0001';

    let activeItems = await Metrc.Item.listActive(licenseNumber);

    console.log(activeItems[0]);
    console.log(activeItems[1]);


})().catch(err => console.error(err.error || err)).then(process.exit);


