'use strict';


const Metrc = require("../lib/metrc");


(async function() {

    console.log(await Metrc.LabTest.listTypes());

})().catch(console.error.bind(console)).then(process.exit);