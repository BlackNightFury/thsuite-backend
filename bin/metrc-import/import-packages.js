
const {ProductType, Product, Package, Supplier, Item, Alert} = alias.require('@models');
const Metrc = alias.require('@lib/metrc');

const uuid = require('uuid');

const createItem = require('./lib/create-item');

module.exports = async function(store) {

    let packages = [].concat(
        await Metrc.Package.listActive(store.licenseNumber),
        await Metrc.Package.listOnHold(store.licenseNumber),
        await Metrc.Package.listInactive(store.licenseNumber)
    );

    for(let metrcPackage of packages) {

        let {item} = await createItem(store, metrcPackage);

        let _package = await Package.create({
            id: uuid.v4(),
            storeId: store.id,
            itemId: item.id,
            availableQuantity: metrcPackage.Quantity,

            MetrcId: metrcPackage.Id,
            Label: metrcPackage.Label,
            PackageType: metrcPackage.PackageType,
            SourceHarvestNames: metrcPackage.SourceHarvestNames,
            Quantity: metrcPackage.Quantity,
            UnitOfMeasureName: metrcPackage.UnitOfMeasureName,
            UnitOfMeasureAbbreviation: metrcPackage.UnitOfMeasureAbbreviation,

            PackagedDate: metrcPackage.PackagedDate,
            InitialLabTestingState: metrcPackage.InitialLabTestingState,
            LabTestingState: metrcPackage.LabTestingState,
            LabTestingStateName: metrcPackage.LabTestingStateName,
            LabTestingStateDate: metrcPackage.LabTestingStateDate,
            IsProductionBatch: metrcPackage.IsProductionBatch,
            ProductionBatchNumber: metrcPackage.ProductionBatchNumber,
            IsTestingSample: metrcPackage.IsTestingSample,
            IsProcessValidationTestingSample: metrcPackage.IsProcessValidationTestingSample,
            ProductRequiresRemediation: metrcPackage.ProductRequiresRemediation,
            ContainsRemediatedProduct: metrcPackage.ContainsRemediatedProduct,
            RemediationDate: metrcPackage.RemediationDate,

            IsOnHold: metrcPackage.IsOnHold,
            ArchivedDate: metrcPackage.ArchivedDate,
            FinishedDate: metrcPackage.FinishedDate,
            LastModified: metrcPackage.LastModified
        });


        await Alert.create({
            title: 'Verify Package Wholesale',
            description: `Package ${metrcPackage.Label} needs the wholesale price to be verified`,
            url: `/admin/inventory/items/view/${item.id}/packages/edit/${_package.id}`,
            type: 'package-wholesale-not-verified',
            entityId: _package.id
        })
    }

    console.log(`Imported ${packages.length} Packages`);
};