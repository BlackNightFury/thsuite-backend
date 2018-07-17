
const { Package, Alert } = alias.require('@models');


module.exports = async function(_package) {

    let existingPackage = await Package.find({
        where: {
            id: _package.id,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingPackage) {
        existingPackage = Package.build({});
    }

    let isNewRecord = existingPackage.isNewRecord;

    if(!isNewRecord) {
        // if(existingPackage.version !== _package.version) {
        //     throw new Error("Version mismatch");
        // }

        existingPackage.version++;
    }

    existingPackage.id = _package.id;
    existingPackage.version = _package.version;
    existingPackage.itemId = _package.itemId;

    existingPackage.MetrcId = _package.MetrcId;

    existingPackage.Label = _package.Label;
    existingPackage.wholesalePrice = _package.wholesalePrice;
    existingPackage.Quantity = _package.Quantity;
    existingPackage.availableQuantity = _package.availableQuantity;

    existingPackage.UnitOfMeasureName = _package.UnitOfMeasureName;
    existingPackage.UnitOfMeasureAbbreviation = _package.UnitOfMeasureAbbreviation;

    existingPackage.thcPercent = _package.thcPercent;
    existingPackage.cbdPercent = _package.cbdPercent;
    existingPackage.strainType = _package.strainType;
    existingPackage.ingredients = _package.ingredients;

    if (_package.convertedFromPackageIds) {
        existingPackage.convertedFromPackageIds = _package.convertedFromPackageIds;
    }

    existingPackage.supplierId = _package.supplierId;

    existingPackage.ReceivedQuantity = _package.ReceivedQuantity;
    existingPackage.ReceivedDateTime = _package.ReceivedDateTime;

    if(isNewRecord){
        existingPackage.availableQuantity = existingPackage.Quantity;
        //Only able to set/change ReceivedQuantity when a new non cannabis package is created -- no longer true, MD needs to be able to set at all times
        existingPackage.ReceivedQuantity = _package.ReceivedQuantity;
    }

    await existingPackage.save();

    await Alert.destroy({
        where: {
            type: 'package-wholesale-not-verified',
            entityId: existingPackage.id
        }
    });

    if(isNewRecord) {
        if (this.broadcast) {
            this.broadcast.emit('create', existingPackage.get({plain: true}));
        }
    }
    else {
        if (this.broadcast) {
            this.broadcast.emit('update', existingPackage.get({plain: true}));
        }
    }

    return existingPackage
};
