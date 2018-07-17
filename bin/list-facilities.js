'use strict';


const Metrc = require("../lib/metrc");


(async function() {

    let facilities = await Metrc.Facility.list();

    console.log(facilities)

})().catch(console.error.bind(console)).then(process.exit);