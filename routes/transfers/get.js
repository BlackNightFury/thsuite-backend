const { Transfer, Supplier } = alias.require('@models');


module.exports = async function(transferId) {

    let supplierInclude = {
        model: Supplier,
        attributes: ['name']
    };

    let transfer = await Transfer.findOne({
        where: {
            id: transferId
        },
        // include: [
        //     supplierInclude
        // ]
    });


    return transfer.get({plain: true})
};