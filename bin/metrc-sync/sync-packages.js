
const {Package, Transaction, Alert, BarcodeProductVariationItemPackage, Barcode, Supplier} = alias.require('@models');
const Metrc = alias.require('@lib/metrc');
const {Item: MetrcItem} = alias.require('@lib/metrc');
const config = require('../../config');

const uuid = require('uuid');

const findOrCreateItem = require('./lib/find-or-create-item');

let suppliersMap = {};

async function getSuppliersMap() {
    // Fetch only used attributes
    const suppliers = await Supplier.findAll({attributes: ['id', 'name', 'licenseNumber']});
    let suppliersMap = {};

    for (let supplier of suppliers) {
        suppliersMap[supplier.licenseNumber] = supplier;
    }

    return suppliersMap;
}

async function getSupplierByMetrc(metrcPackage) {

    if (!suppliersMap[metrcPackage.ReceivedFromFacilityLicenseNumber]) {
        suppliersMap[metrcPackage.ReceivedFromFacilityLicenseNumber] = await Supplier.create({
            id: uuid.v4(),
            name: metrcPackage.ReceivedFromFacilityName,
            licenseNumber: metrcPackage.ReceivedFromFacilityLicenseNumber
        });

    }

    return suppliersMap[metrcPackage.ReceivedFromFacilityLicenseNumber];
}

module.exports = async function(store, syncInactive = false) {

    suppliersMap = await getSuppliersMap();

    let packages = await Metrc.Package.listActive(store.licenseNumber);
    const metrcItems = await MetrcItem.listActive(store.licenseNumber);

    if(syncInactive) {
        packages = packages.concat(
            await Metrc.Package.listOnHold(store.licenseNumber),
            await Metrc.Package.listInactive(store.licenseNumber)
        )
    }

    // In some states like Maryland transfers (and as a result ReceivedQuantity) are not available
    const transfersAreNotAvailable = config.environment.metrcTransfersAreNotAvailable ? true : false;

    for(let metrcPackage of packages) {

        let _package = await Package.find({
            where: {
                $or: {
                    MetrcId: metrcPackage.Id,
                    Label: metrcPackage.Label
                }
            },
            include: [
                {
                    model: BarcodeProductVariationItemPackage,
                    include: [
                        {
                            model: Barcode,
                            // required: true
                        }
                    ]
                },
                {
                    model: Transaction,
                    where: {
                        sentToMetrc: null
                    },
                    required: false
                }
            ]
        });

        console.log(`Syncing ${_package ? 'existing' : 'new'} package ${metrcPackage.Label}`);


        if(_package) {

            let soldInventory =
                _package.Transactions.reduce((acc, trans) => acc + trans.QuantitySold, 0);

            let allocatedInventory =
                _package.BarcodeProductVariationItemPackages.reduce((acc, barcode) => (barcode.Barcode ? barcode.Barcode.remainingInventory : 0) + acc, 0);



            if(soldInventory) {
                console.log(`Unreported transactions totaling ${soldInventory} quantity`);
            }

            if((metrcPackage.Quantity - soldInventory) != _package.Quantity) {
                console.log(`Quantity expected ${_package.Quantity}, got ${metrcPackage.Quantity - soldInventory}`);
            }

            Object.assign(_package, {
                Quantity: metrcPackage.Quantity - soldInventory,
                availableQuantity: metrcPackage.Quantity - soldInventory - allocatedInventory,

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
                LastModified: metrcPackage.LastModified,

                ManifestNumber: metrcPackage.ReceivedFromManifestNumber
            });

            if (transfersAreNotAvailable && !_package.ReceivedDateTime && metrcPackage.ReceivedDateTime) {
                _package.ReceivedDateTime = metrcPackage.ReceivedDateTime;
                _package.ReceivedQuantitiy = metrcPackage.Quantity;
            }

            //Double check item
            let existingItem = await _package.getItem();
            let {item} = await findOrCreateItem(store, metrcPackage);
            let metrcItem = item;
            //If there isn't an item associated with this package, find or create it based on the metrcPackage
            if(!existingItem){
                existingItem = item;
            }
            //If the metrcItem id does not match the existing item id, change _package.itemId to be metrcItem id
            if(metrcItem.id !== existingItem.id){
                _package.itemId = metrcItem.id;
            }

            //Double check supplier
            let supplier = await getSupplierByMetrc(metrcPackage);
            //if package doesn't have supplier, or existing supplier doesn't match new supplier AND new supplier is actually set
            if((!_package.supplierId || _package.supplierId !== supplier.id) && metrcPackage.ReceivedFromFacilityLicenseNumber){
                _package.supplierId = supplier.id;
            }

            //At this point we can assume package supplier is set to the proper value, so if item supplier doesn't match package supplier, we update
            if (!existingItem.supplierId || _package.supplierId !== existingItem.supplierId) {
                existingItem.supplierId = _package.supplierId;
                await existingItem.save();
            }

            //Last check -- is this a result of a create/convert?
            if(_package.MetrcId < 0){
                _package.MetrcId = metrcPackage.Id;
            }

            await _package.save();

            continue;
        }

        let selfCreated = false;

        for (let i=0; i<metrcItems.length; i++) {
            if (metrcItems[i].Id === metrcPackage.ProductId) {
                selfCreated = true;
                break;
            }
        }

        let {item} = await findOrCreateItem(store, metrcPackage);

        //Handle supplier
        let supplier = await getSupplierByMetrc(metrcPackage);

        //Check item
        if(!item.supplierId){
            item.supplierId = supplier.id;
            await item.save();
        }

        const newPackageObject = {
            id: uuid.v4(),
            storeId: store.id,
            itemId: item.id,
            supplierId: supplier.id,
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
            LastModified: metrcPackage.LastModified,

            ReceivedDateTime: (selfCreated ? metrcPackage.LastModified : metrcPackage.ReceivedDateTime),
            ReceivedQuantitiy: (selfCreated ? metrcPackage.Quantity : null),
            ManifestNumber: metrcPackage.ReceivedFromManifestNumber
        };

        if (transfersAreNotAvailable && metrcPackage.ReceivedDateTime) {
            newPackageObject.ReceivedQuantitiy = metrcPackage.Quantity;
        }

        _package = await Package.create(newPackageObject);

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
