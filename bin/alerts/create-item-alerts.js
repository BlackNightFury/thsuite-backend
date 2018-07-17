require('../../init');

const {Item, Alert} = alias.require('@models');

(async function() {

    let cannabisEachItems = await Item.findAll({
        where: {
            $and: [
                {UnitOfMeasureName: {$eq: 'Each'}},
                {$and: [ {MetrcId: {$not: null}}, {MetrcId: {$gt: 0}} ] },
                {$or: [ {thcWeight: {$eq: null}}, {thcWeight: {$eq: 0}} ] }
            ]
        },
        logging: console.log
    });

    console.log(">>> working...");
    console.log(">>> might be a few minutes so sit tight...");

    for(let item of cannabisEachItems) {

        await Alert.create({
            title: 'Set THC Weight',
            description: `${item.name} is an each based cannabis item that must have a non-zero THC Weight`,
            url: `/admin/inventory/items/edit/${item.id}`,
            type: 'item-missing-thc-weight',
            entityId: item.id
        })
    }
})();