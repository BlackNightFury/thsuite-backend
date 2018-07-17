
const {ProductType, Product, Item, Strain} = alias.require('@models');
const {Item: MetrcItem} = alias.require('@lib/metrc');

const uuid = require('uuid');

const createItem = require('./lib/create-item');

module.exports = async function(store) {

    let metrcItems = await MetrcItem.listActive(store.licenseNumber);

    let importedProductCount = 0;

    for(let metrcItem of metrcItems) {

        await createItem(store, metrcItem);

        importedProductCount++;
    }


    console.log(`Imported ${importedProductCount} Products`)
};