'use strict';


const Metrc = require("../lib/metrc");


(async function() {

    let facilities = await Metrc.Facility.list();

    console.log(
        facilities
            .filter(f => f.License.LicenseType == 'Recreational Producer')
    )

})().catch(console.error.bind(console)).then(process.exit);