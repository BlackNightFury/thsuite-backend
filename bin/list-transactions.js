'use strict';


const Metrc = require("../lib/metrc");


(async function() {

    console.log(await Metrc.Sale.listTransactions('402R-00343'));

})().catch(console.error.bind(console)).then(process.exit);