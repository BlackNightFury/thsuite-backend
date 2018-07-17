const models = alias.require('@models');
const { Transfer, Delivery, DeliveryPackage, Package, Supplier, sequlize} = models;

module.exports = async function(args){

    let transferId = args.id;
    let type = args.type;


    let deliveryPackageInclude = {
        model: DeliveryPackage,
        attributes: ['id', 'packageId', 'PackageLabel', 'ProductName', 'ProductCategoryName', 'ShippedQuantity', 'ReceivedQuantity', 'ShippedUnitOfMeasureName']
    };

    let deliveryInclude = {
        model: Delivery,
        attributes: ['id','transferId', 'MetrcId', 'RecipientFacilityName'],
        include: [deliveryPackageInclude]
    };



    let {count, rows} = await Transfer.findAndCountAll({

        attributes: ['id'],
        where: {
            id: transferId,
            type: type
        },
        include: [
            deliveryInclude
        ]

    });

    return rows;

}