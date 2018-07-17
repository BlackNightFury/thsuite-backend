require('../../init');

const {Package, Alert} = alias.require('@models');



(async function() {

    let packages = await Package.findAll({
        where: {
            Quantity: {$gt: 0},
            FinishedDate: null,
            ArchivedDate: null,
            wholesalePrice: 0
        }
    });

    for(let _package of packages) {
        await Alert.create({
            title: 'Verify Package Wholesale',
            description: `Package ${_package.Label} needs the wholesale price to be verified`,
            url: `/admin/inventory/items/view/${_package.itemId}/packages/edit/${_package.id}`,
            type: 'package-wholesale-not-verified',
            entityId: _package.id
        })
    }



})();