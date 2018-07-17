
const { Store, StoreSettings } = alias.require('@models');


module.exports = async function(store) {

    let existingStore = await Store.find({
        where: {
            id: store.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingStore) {
        existingStore = Store.build({});
    }

    let isNewRecord = existingStore.isNewRecord;

    if(!isNewRecord) {
        if(existingStore.version !== store.version) {
            //TODO: uncomment
            //throw new Error("Version mismatch");
        }

        store.version++;
    }

    existingStore.id = store.id;
    existingStore.version = store.version;

    existingStore.name = store.name;
    existingStore.city = store.city;
    existingStore.state = store.state;
    existingStore.storeManager = store.storeManager;
    existingStore.taxesIncluded = store.taxesIncluded;

    await existingStore.save();

    // Null values are not allowed in StoreSettings model so if they'll appear the sequelize validator will get angry.
    ['lowBarcodeThreshold', 'lowInventoryGramThreshold', 'lowInventoryEachThreshold', 'alertOnLowBarcode', 'alertOnLowInventory',
        'enableDrawerLimit', 'drawerAmountForAlert'].forEach(key => {
        if (store.settings[key] === null) {
            delete store.settings[key];
        }
    });

    let settings = await StoreSettings.update( store.settings, { where: { storeId: store.id } } );

    if(isNewRecord) {
        this.broadcast.emit('create', existingStore.get());
    }
    else {
        this.broadcast.emit('update', existingStore.get());
    }

    return existingStore
};
