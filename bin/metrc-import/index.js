require('../../init');

const config = require('../../config');

let initUsers = require('./init/init-users');
let initTaxes = require('./init/init-taxes');
let initDiscounts = require('./init/init-discounts');
let initPatientGroups = require('./init/init-patient-groups');
let initPricingTiers = require('./init/init-pricing-tiers');

let importFacilities = require('./import-facilities');
let importProductCategories = require("./import-product-categories");
let importItems = require('./import-items');
let importPackages = require('./import-packages');
let importTransfers = require('./import-transfers');
let importTransactions = require("./import-transactions");
let reconcilePackageQuantity = require('./post-import/reconcile-package-quantity');
let dummyTransactionData = require('./post-import/dummy-transaction-data');
let dummyProductPrices = require('./post-import/dummy-product-prices');

(async function() {

    try {

        await initUsers();
        await initDiscounts();
        await initTaxes();
        await initPatientGroups();
        await initPricingTiers();

        await importProductCategories();

        let stores = await importFacilities();

        for(let store of stores) {
            console.log("Importing store with licenseNumber: " + store.licenseNumber);

            await importItems(store);
            await importPackages(store);
            await importTransfers(store);
            await importTransactions(store)
        }

        //Temporary post processing
        await reconcilePackageQuantity();

        if(config.metrc.createDummyData) {

            await dummyTransactionData();
            await dummyProductPrices();

        }
    }
    catch(err) {
        console.error(err.error || err);
    }

    console.log("Done");
})();