
const { Store } = alias.require('@models');


module.exports = async function() {

    let stores = await Store.findAll({

    });

    return stores.map(s => s.id);
};