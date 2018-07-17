const {DeliveryPackage} = alias.require('@models');

module.exports = async function({packageId, packageLabel}){

    let deliveryPackage = await DeliveryPackage.findOne({
        where: {
            $or: [ { packageId }, { PackageLabel: packageLabel } ]
        }
    });

    if(!deliveryPackage){
        return null
    }else{
        return deliveryPackage.id;
    }


}
