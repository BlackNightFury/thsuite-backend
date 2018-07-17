const { Package, PackageUnusedLabel } = alias.require('@models');
const config = require('../../config');
const uuid = require('uuid/v4');
const updatePackage = require('./update');
const moment = require('moment');

module.exports = async function({ packages, outDate, outItemId, outPackageLabeId, outSupplierId }) {
    const newPackageLabel = await PackageUnusedLabel.findOne({
        where: {
            id: outPackageLabeId
        }
    });

    if (!newPackageLabel || !newPackageLabel.Label) {
        throw new Error('Failed to find new package label');
    }

    const duplicateLabel = await Package.findOne({
        attributes: [ 'Label' ],
        where: {
            Label: newPackageLabel.Label
        }
    });

    if (duplicateLabel) {
        throw new Error('Such package already exists');
    }

    const existingPackageIds = [];
    let quantity = 0;
    let existingPackage;

    for (const _package of packages) {

        existingPackage = await Package.findOne({
            where: {
                id: _package.packageId,
            }
        });

        if (!existingPackage) {
            throw new Error(`Failed to find existing package with id ${_package.packageId}`);
        }
        if (existingPackage.Quantity < _package.quantity) {
            throw new Error(`Existing package quantity is too low for package ${existingPackage.id}; Quantity is "${existingPackage.Quantity}"`);
        }

        quantity += _package.quantity;
    }

    // Another loop because first one might return false in one of the packages
    for (const _package of packages) {
        existingPackage = await Package.findOne({
            where: {
                id: _package.packageId,
            }
        });

        existingPackageIds.push({
            packageId: _package.packageId,
            quantity: _package.quantity
        });

        existingPackage.Quantity -= _package.quantity;
        existingPackage.availableQuantity = Math.max(0, (existingPackage.availableQuantity-_package.quantity));

        await existingPackage.save();
        this.emit('update', existingPackage.get({plain: true}));
    }

    let newPackage;
    const newPackageId = uuid.v4();

    try {
        await newPackageLabel.destroy();

        newPackage = await updatePackage({
            id: newPackageId,
            version: 0,

            itemId: outItemId,

            // Converted packages won't have metrcId at the time of converting. They can't be null too
            MetrcId: config.METRC_CONVERTED_PACKAGE_ID,

            Label: newPackageLabel.Label,
            wholesalePrice: null,
            Quantity: quantity,
            availableQuantity: quantity,
            ReceivedQuantity: quantity,
            ReceivedDateTime: moment.utc().toDate(),

            UnitOfMeasureName: existingPackage.UnitOfMeasureName,
            UnitOfMeasureAbbreviation: existingPackage.UnitOfMeasureAbbreviation,

            supplierId: outSupplierId,
            packageDate: outDate,

            thcPercent: existingPackage.thcPercent,
            cbdPercent: existingPackage.cbdPercent,
            strainType: existingPackage.strainType,
            ingredients: existingPackage.ingredients,
            convertedFromPackageIds: JSON.stringify(existingPackageIds)
        });

    } catch(e) {
        console.error(e);
        return false;
    }

    try {
        this.emit('create', newPackage.get({plain: true}));
        this.emit('remove', newPackageLabel.get({plain: true}));
    } catch(e) {
        // No big deal
    }

    return newPackageId;
};
