
const { Store } = alias.require('@models');


module.exports = async function(storeId) {

    let store = await Store.findOne({
        where: {
            id: storeId
        }
    });

    if(store){
        return store.get({plain: true})
    }
};