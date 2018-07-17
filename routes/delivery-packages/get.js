const { DeliveryPackage } = alias.require('@models');


module.exports = async function(deliveryPackageId) {

    if( !deliveryPackageId ) return null

    let deliveryPackage = await DeliveryPackage.findOne({
        where: {
            id: deliveryPackageId
        }
    });

    if( !deliveryPackage ) return null

    return deliveryPackage.get({plain: true})
};
