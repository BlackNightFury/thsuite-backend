
const {Store, StoreSettings, StoreOversaleLimit} = alias.require('@models');
const {Facility} = alias.require('@lib/metrc');

const uuid = require('uuid');

module.exports = async function() {

    let facilities = await Facility.list();

    let stores = [];

    for(let facility of facilities) {

        if(facility.License.LicenseType != 'Retail Store' && facility.License.LicenseType != 'Medical Dispensary') {
            continue;
        }

        let store = await Store.create({
            id: uuid.v4(),
            name: facility.DisplayName || facility.Name,
            metrcName: facility.Name,
            metrcAlias: facility.Alias,
            licenseType: facility.License.LicenseType,
            licenseNumber: facility.License.Number,
            city: null,
            state: null,
            storeManager: null,
        });

        await StoreSettings.create({
            id: uuid.v4(),
            storeId: store.id,
        });

        await StoreOversaleLimit.create({
            id: uuid.v4(),
            storeId: store.id,

            cartMax: 28,
            buds: 1,
            shakeTrim: 1,
            plants: 1,
            infusedNonEdible: 35,
            infusedEdible: 35,
            concentrate: 3.5
        });

        stores.push(store);
    }


    console.log(`Imported ${stores.length} Stores`);

    return stores;
};