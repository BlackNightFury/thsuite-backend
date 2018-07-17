require("../init");
let models = require("../models");


(async function() {

    models.Store.bulkCreate([
        {
            id: '918756f0-482f-4bc8-95b6-79da81607a3a',
            name: 'Bunds and Roses',
            metricAlias: '',
            licenseType: '',
            city: 'Studio City',
            state: 'CA',
            storeManager: 'Andrew Jacobs'
        },
        {
            id: '9f5397ab-569d-4887-aaae-0f35fb11973c',
            name: 'Herban Legends',
            metricAlias: '',
            licenseType: '',
            city: 'Irvine',
            state: 'CA',
            storeManager: 'Peter Chen'
        },
        {
            id: 'b5a6c4b6-97a1-4e16-8833-4654aa06d243',
            name: 'Hollyweed',
            metricAlias: '',
            licenseType: '',
            city: 'Los Angeles',
            state: 'CA',
            storeManager: 'Joe Miller'
        }
    ]);

})().catch(err => console.error(err));