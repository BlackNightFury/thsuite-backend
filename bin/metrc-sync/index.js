require('../../init');

const config = require('../../config');

const {Store} = require('../../models');

let syncItems = require('./sync-items');
let syncPackages = require('./sync-packages');
let syncTransfers = require('./sync-transfers');
let syncTransactions = require("./sync-transactions");


module.exports = async function() {

    try {

        let stores = await Store.findAll();

        for(let store of stores) {
            console.log("Importing store with licenseNumber: " + store.licenseNumber);

            await syncItems(store);
            await syncPackages(store);
            //MD doesn't have transfers, catch this error
            try{
                await syncTransfers(store);
            }catch(e){
                console.log("Error syncing transfers -- If this is MD, ignore");
            }
            // await syncTransactions(store)
        }

    }
    catch(err) {
        console.error(err.error || err);
    }

    console.log("Done");
};

if(require.main == module) {
    module.exports();
}