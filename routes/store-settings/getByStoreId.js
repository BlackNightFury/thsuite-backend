const { StoreSettings } = alias.require('@models');

module.exports = async function(storeId) {

    let storeSettings = await StoreSettings.findOne({
        where: {
            storeId
        }
    });

    return storeSettings.id;
};
