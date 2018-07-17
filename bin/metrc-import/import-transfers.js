
const {Package, Supplier, Transfer, Delivery, DeliveryPackage, Alert} = alias.require('@models');
const {Transfer: MetrcTransfer} = alias.require('@lib/metrc');

const uuid = require('uuid');

module.exports = async function(store) {

    const transferTypes = ['incoming', 'outgoing', 'rejected'];

    let importedTransferCount = 0;
    let newSupplierCount = 0;

    for(let type of transferTypes){

        console.log(`Now importing ${type} transfers`);

        let metrcTransfers = await MetrcTransfer.listTransferType(store.licenseNumber, type);

        let suppliers = await Supplier.findAll();
        let suppliersMap = {};
        for(let supplier of suppliers) {
            suppliersMap[supplier.licenseNumber] = supplier;
        }

        let packages = await Package.findAll();
        let packagesMap = {};
        for(let _package of packages) {
            packagesMap[_package.MetrcId] = _package;
        }

        let deliveryPackages = await DeliveryPackage.findAll();
        let deliveryPackagesMap = {};
        for(let _deliveryPackage of deliveryPackages) {
            deliveryPackagesMap[_deliveryPackage.MetrcId] = _deliveryPackage;
        }

        for(let metrcTransfer of metrcTransfers) {

            let supplier = suppliersMap[metrcTransfer.ShipperFacilityLicenseNumber];
            if(!supplier) {
                supplier = await Supplier.create({
                    id: uuid.v4(),
                    name: metrcTransfer.ShipperFacilityName,
                    licenseNumber: metrcTransfer.ShipperFacilityLicenseNumber
                });
                newSupplierCount++;

                suppliers.push(supplier);
                suppliersMap[supplier.licenseNumber] = supplier;
            }

            let transfer = await Transfer.create({
                id: uuid.v4(),

                storeId: store.id,

                type: type,

                MetrcId: metrcTransfer.Id,
                ManifestNumber: metrcTransfer.ManifestNumber,

                supplierId: supplier.id,

                DriverName: metrcTransfer.DriverName,
                DriverOccupationalLicenseNumber: metrcTransfer.DriverOccupationalLicenseNumber,
                DriverVehicleLicenseNumber: metrcTransfer.DriverVehicleLicenseNumber,

                VehicleMake: metrcTransfer.VehicleMake,
                VehicleModel: metrcTransfer.VehicleModel,
                VehicleLicensePlateNumber: metrcTransfer.VehicleLicensePlateNumber,

                DeliveryCount: metrcTransfer.DeliveryCount,
                ReceivedDeliveryCount: metrcTransfer.ReceivedDeliveryCount,

                PackageCount: metrcTransfer.PackageCount,
                ReceivedPackageCount: metrcTransfer.ReceivedPackageCount,

                CreatedDateTime: metrcTransfer.CreatedDateTime,
                CreatedByUserName: metrcTransfer.CreatedByUserName,
                LastModified: metrcTransfer.LastModified,

                MetrcDeliveryId: metrcTransfer.DeliveryId,

                EstimatedDepartureDateTime: metrcTransfer.EstimatedDepartureDateTime,
                EstimatedArrivalDateTime: metrcTransfer.EstimatedArrivalDateTime,

                DeliveryPackageCount: metrcTransfer.DeliveryPackageCount,
                DeliveryReceivedPackageCount: metrcTransfer.DeliveryReceivedPackageCount,

                ReceivedDateTime: metrcTransfer.ReceivedDateTime
            });


            if(type == 'incoming') {
                if(!metrcTransfer.ReceivedDateTime) {
                    await Alert.create({
                        title: 'Receive Transfer',
                        description: `Transfer from ${supplier.name} with ETA ${transfer.EstimatedArrivalDateTime}`,
                        url: `/admin/inventory/incoming/view/${transfer.id}`,
                        type: 'transfer-not-received',
                        entityId: transfer.id
                    })
                }
            }

            let deliveryId;
            let delivery;

            if(type == 'outgoing') {

                try {
                    let metrcDeliveries = await MetrcTransfer.listDeliveries(store.licenseNumber, metrcTransfer.Id);
                    let metrcDelivery = metrcDeliveries[0];

                    //We can fill in delivery info from these results
                    delivery = await Delivery.create({
                        id: uuid.v4(),
                        transferId: transfer.id,
                        //THIS IS ID THAT NEEDS TO GO TO PACKAGES
                        MetrcId: metrcDelivery.Id,

                        RecipientFacilityLicenseNumber: metrcDelivery.RecipientFacilityLicenseNumber,
                        RecipientFacilityName: metrcDelivery.RecipientFacilityName,

                        ShipmentType: metrcDelivery.ShipmentType,

                        EstimatedDepartureDateTime: metrcDelivery.EstimatedDepartureDateTime,
                        EstimatedArrivalDateTime: metrcDelivery.EstimatedArrivalDateTime,

                        PlannedRoute: metrcDelivery.PlannedRoute,

                        DeliveryPackageCount: metrcDelivery.DeliveryPackageCount,
                        DeliveryReceivedPackageCount: metrcDelivery.DeliveryReceivedPackageCount,

                        ReceivedDateTime: metrcDelivery.ReceivedDateTime
                    });

                    deliveryId = metrcDelivery.Id;

                } catch (err) {
                    console.log("Error getting delivery info for: " + deliveryId);
                    console.log(err);
                    deliveryId = null;
                }


            } else {
                //Need to fill in delivery data from the transfer as best we can
                deliveryId = metrcTransfer.DeliveryId;

                delivery = await Delivery.create({
                    id: uuid.v4(),
                    transferId: transfer.id,

                    MetrcId: deliveryId,

                    EstimatedDepartureDateTime: metrcTransfer.EstimatedDepartureDateTime,
                    EstimatedArrivalDateTime: metrcTransfer.EstimatedArrivalDateTime,

                    DeliveryPackageCount: metrcTransfer.DeliveryPackageCount,
                    DeliveryReceivedPackageCount: metrcTransfer.DeliveryReceivedPackageCount,

                    ReceivedDateTime: metrcTransfer.ReceivedDateTime
                });
            }


            if(deliveryId){
                let metrcPackages = await MetrcTransfer.listPackages(store.licenseNumber, deliveryId);

                //Only do this for incoming transfers with ReceivedDateTime
                if(!!metrcTransfer.ReceivedDateTime && type == 'incoming') {
                    for (let metrcPackage of metrcPackages) {

                        let _package = packagesMap[metrcPackage.PackageId];
                        if (!_package) {
                            console.log("Could not find package with id " + metrcPackage.PackageId);
                            continue;
                        }

                        if (metrcPackage.ShippedQuantity !== metrcPackage.ReceivedQuantity) {
                            console.log("Transfer package shipped != received for package with id " + metrcPackage.PackageId);
                        }

                        // _package.transferId = transfer.id;
                        _package.ShippedQuantity = metrcPackage.ShippedQuantity;
                        _package.ReceivedQuantity = metrcPackage.ReceivedQuantity;
                        _package.ReceivedDateTime = metrcTransfer.ReceivedDateTime;

                        _package.supplierId = supplier.id; //TODO shouldn't be necessary but import packages is broken on metrc
                        await _package.save();

                        let _item = await _package.getItem();
                        if (supplier.id !== _item.supplierId) {
                            _item.supplierId = supplier.id;
                            await _item.save();
                        }
                    }
                }

                //Every type of transfer packages go into delivery packages

                for (let metrcPackage of metrcPackages) {

                    let _deliveryPackage = deliveryPackagesMap[metrcPackage.PackageId];

                    if(!_deliveryPackage){

                        //Get this packages UUID
                        let _package = packagesMap[metrcPackage.PackageId];
                        let packageId;
                        if(!_package) {
                            packageId = null;
                        } else {
                            packageId = _package.id;
                        }

                        //Doesnt't already exist, create it
                        let deliveryPackage = await DeliveryPackage.create({
                            id: uuid.v4(),

                            deliveryId: delivery.id,
                            packageId: packageId,

                            MetrcPackageId: metrcPackage.PackageId,

                            PackageLabel: metrcPackage.PackageLabel,

                            SourceHarvestNames: metrcPackage.SourceHarvestNames,
                            ProductName: metrcPackage.ProductName,
                            ProductCategoryName: metrcPackage.ProductCategoryName,

                            ShipmentPackageState: metrcPackage.ShipmentPackageState,

                            ShippedQuantity: metrcPackage.ShippedQuantity,
                            ShippedUnitOfMeasureName: metrcPackage.ShippedUnitOfMeasureName,

                            ReceivedQuantity: metrcPackage.ReceivedQuantity,
                            ReceivedUnitOfMeasureName: metrcPackage.ReceivedUnitOfMeasureName,

                            ReceivedDateTime: metrcPackage.ReceivedDateTime
                        });
                    }

                }

            }

            importedTransferCount++;
    }


    }


    console.log(`Imported ${importedTransferCount} Transfers`)
};