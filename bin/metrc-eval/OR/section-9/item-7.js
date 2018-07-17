'use strict';

const moment = require('moment');

const Metrc = require("../../../../lib/metrc/index");


(async function() {
    const random = Math.floor(Math.random() * 1e6);

    const licenseNumber = '050-X0002';
    const date = moment().format();

    await Metrc.Sale.deleteDelivery(licenseNumber, 952);



})().catch(err => console.error(err.error || err)).then(process.exit);





