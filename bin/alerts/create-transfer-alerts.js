require('../../init');

const {Transfer, Supplier, Alert} = alias.require('@models');



(async function() {

    let transfers = await Transfer.findAll({
        where: {
            type: 'incoming',
            ReceivedDateTime: null
        },
        include: [Supplier]
    });

    for(let transfer of transfers) {
        await Alert.create({
            title: 'Receive Transfer',
            description: `Transfer from ${transfer.Supplier.name} with ETA ${transfer.EstimatedArrivalDateTime}`,
            url: `/admin/inventory/incoming/edit/${transfer.id}`,
            type: 'transfer-not-received',
            entityId: transfer.id
        })
    }



})();