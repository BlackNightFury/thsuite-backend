
const { Package } = alias.require('@models');


module.exports = async function(itemId) {

    let _packages = await Package.findAll({
        where: {
            itemId: itemId
        }
    });

    return _packages.map(p => p.id);
};