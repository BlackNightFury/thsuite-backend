const {Package, Supplier, Transfer, Delivery, DeliveryPackage, Alert} = alias.require('@models');
const {Transfer: MetrcTransfer} = alias.require('@lib/metrc');
const util = require('util');

const uuid = require('uuid');

let packagesMap = {};
let suppliersMap = {};
let deliveryPackagesMap = {};

let importedTransferCount = 0;
let newSupplierCount = 0;

function inspect(args, label) {
    console.log("STARTED", label);

    Object.keys(args).forEach(arg => {
        console.log(`ARG ${arg}:`, util.inspect(args[arg], false, 1));
    });

    console.log("FINISHED", label);
}

async function getSuppliersMap() {
    // Fetch only used attributes
    const suppliers = await Supplier.findAll({attributes: ['id', 'name', 'licenseNumber']});
    let suppliersMap = {};

    for (let supplier of suppliers) {
        suppliersMap[supplier.licenseNumber] = supplier;
    }

    return suppliersMap;
}

async function getPackagesMap() {
    // Package entity is saved, so we need everything
    const packages = await Package.findAll();
    let packagesMap = {};

    for (let _package of packages) {
        packagesMap[_package.MetrcId] = _package;
    }

    return packagesMap;
}

async function getDeliveryPackagesMap() {
    // DeliveryPackage entity is used only to check existance, so fetch bare minimum
    const deliveryPackages = await DeliveryPackage.findAll({attributes: ['MetrcPackageId']});
    let deliveryPackagesMap = {};

    for(let _deliveryPackage of deliveryPackages) {
        deliveryPackagesMap[_deliveryPackage.MetrcPackageId] = true;
    }

    return deliveryPackagesMap;
}

async function getSupplierByMetrc({ metrcTransfer }) {
    inspect(arguments, 'Calling function getSupplierByMetrc');

    if (!suppliersMap[metrcTransfer.ShipperFacilityLicenseNumber]) {
        suppliersMap[metrcTransfer.ShipperFacilityLicenseNumber] = await Supplier.create({
            id: uuid.v4(),
            name: metrcTransfer.ShipperFacilityName,
            licenseNumber: metrcTransfer.ShipperFacilityLicenseNumber
        });

        newSupplierCount++;
    }

    return suppliersMap[metrcTransfer.ShipperFacilityLicenseNumber];
}

async function saveMetrcPackage({ metrcPackage, metrcTransfer, supplier }) {
    inspect(arguments, 'Calling function saveMetrcPackage');

    const _package = packagesMap[metrcPackage.PackageId];

    if (!_package) {
        console.log("Could not find package with id " + metrcPackage.PackageId);
        return;
    }

    if (metrcPackage.ShippedQuantity !== metrcPackage.ReceivedQuantity) {
        console.log("Transfer package shipped != received for package with id " + metrcPackage.PackageId);
    }

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

async function updateTransfer({ transfer, metrcTransfer, type, store, supplier }) {
    inspect(arguments, 'Calling function updateTransfer');

    if (!transfer.ReceivedDateTime && metrcTransfer.ReceivedDateTime) {
        console.log(`Receiving Transfer`);
    }

    if (transfer.ReceivedDateTime !== metrcTransfer.ReceivedDateTime) {
        transfer.ReceivedDateTime = metrcTransfer.ReceivedDateTime;
        await transfer.save();
    }

    if (type == 'incoming') {

        let delivery = await Delivery.find({
            where: {
                MetrcId: transfer.MetrcDeliveryId
            }});

        if (delivery.ReceivedDateTime !== metrcTransfer.ReceivedDateTime) {
            delivery.ReceivedDateTime = metrcTransfer.ReceivedDateTime;
            await delivery.save();
        }

        const metrcPackages = await MetrcTransfer.listPackages(store.licenseNumber, transfer.MetrcDeliveryId);

        for (let metrcPackage of metrcPackages) {
            await saveMetrcPackage({ metrcPackage, metrcTransfer, supplier });
        }
    }
}

async function createDelivery({ metrcTransfer, transfer, type, store }) {
    inspect(arguments, 'Calling function createDelivery');

    let delivery;
    let deliveryId;

    if (type == 'outgoing') {

        try {
            const metrcDelivery = await MetrcTransfer.listDeliveries(store.licenseNumber, metrcTransfer.Id)[0];

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
        if (metrcTransfer.DeliveryId) {
            deliveryId = parseInt(metrcTransfer.DeliveryId.toString().slice(), 10);
        }

        console.log(`Creating delivery for deliveryId: ${deliveryId}`);
        console.log('Trying to create delivery with params:', {
            transferId: transfer.id,
            MetrcId: deliveryId,
            EstimatedDepartureDateTime: metrcTransfer.EstimatedDepartureDateTime,
            EstimatedArrivalDateTime: metrcTransfer.EstimatedArrivalDateTime,
            DeliveryPackageCount: metrcTransfer.DeliveryPackageCount,
            DeliveryReceivedPackageCount: metrcTransfer.DeliveryReceivedPackageCount,
            ReceivedDateTime: metrcTransfer.ReceivedDateTime
        });

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

        console.log('created delivery', util.inspect(delivery, false, 1));
    }

    return { delivery, deliveryId };
}

async function createDeliveryPackage({ metrcPackage, delivery }) {
    inspect(arguments, 'Calling function createDeliveryPackage');

    const _deliveryPackage = deliveryPackagesMap[metrcPackage.PackageId];

    if (!_deliveryPackage){


        //Get this packages UUID
        const _package = packagesMap[metrcPackage.PackageId];
        const packageId = _package ? _package.id : null;

        console.log(`Creating delivery package with deliveryId: ${delivery.id} and packageId: ${packageId} and MetrcPackageId: ${metrcPackage.PackageId}`);

        //Doesnt't already exist, create it

        await DeliveryPackage.create({
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

        deliveryPackagesMap[metrcPackage.PackageId] = true;
    } else {
        console.log(`Can't create delivery package because packagesMap missing packageId ${metrcPackage.PackageId}`);
    }
}

async function createTransfer({ metrcTransfer, type, store, supplier }) {
    inspect(arguments, 'Calling function createTransfer');

    const transfer = await Transfer.create({
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

    if (type == 'incoming' && !metrcTransfer.ReceivedDateTime) {
        await Alert.create({
            title: 'Receive Transfer',
            description: `Transfer from ${supplier.name} with ETA ${transfer.EstimatedArrivalDateTime}`,
            url: `/admin/inventory/incoming/view/${transfer.id}`,
            type: 'transfer-not-received',
            entityId: transfer.id
        });
    }

    const { delivery, deliveryId } = await createDelivery({ metrcTransfer, transfer, type, store })

    console.log(`createDelivery() created delivery with deliveryId ${deliveryId}`);
    console.log('delivery', util.inspect(delivery, false, 1));

    if (deliveryId){
        const metrcPackages = await MetrcTransfer.listPackages(store.licenseNumber, deliveryId);

        console.log(`Found ${Object.keys(metrcPackages).length} metrcPackages in createTransfer() function`);
        console.log('metrcPackages', util.inspect(metrcPackages, false, 1));

        //Only do this for incoming transfers with ReceivedDateTime
        if (!!metrcTransfer.ReceivedDateTime && type == 'incoming') {
            for (let metrcPackage of metrcPackages) {
                await saveMetrcPackage({ metrcPackage, metrcTransfer, supplier });
            }
        }

        //Every type of transfer packages go into delivery packages

        for (let metrcPackage of metrcPackages) {
            await createDeliveryPackage({ metrcPackage, delivery });
        }
    }
}

async function processMetrcTransfer({ metrcTransfer, type, store }) {
    inspect(arguments, 'Calling function processMetrcTransfer');

    console.log(`Processing Transfer ${metrcTransfer.Id}`);

    const supplier = await getSupplierByMetrc({ metrcTransfer });

    let transfer = await Transfer.find({
        where: {
            MetrcId: metrcTransfer.Id
        }
    });

    if (transfer) {
        await updateTransfer({ transfer, metrcTransfer, type, store, supplier });
    } else {
        await createTransfer({ metrcTransfer, type, store, supplier });
        importedTransferCount++;
    }
}

async function syncTransfers(store) {
    inspect(arguments, "Calling function syncTransfers");

    const transferTypes = ['incoming', 'outgoing', 'rejected'];

    packagesMap = await getPackagesMap();
    suppliersMap = await getSuppliersMap();
    deliveryPackagesMap = await getDeliveryPackagesMap();

    console.log(`packagesMap contains ${ Object.keys(packagesMap).length } records`);
    console.log(`suppliersMap contains ${ Object.keys(suppliersMap).length } records`);
    console.log(`deliveryPackagesMap contains ${ Object.keys(deliveryPackagesMap).length } records`);

    let used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`[${new Date().toString()}] Memory usage: ${Math.round(used * 100) / 100} MB`);

    for (let type of transferTypes){

        console.log(`Now importing ${type} transfers`);

        const metrcTransfers = await MetrcTransfer.listTransferType(store.licenseNumber, type);

        for (let i=0; i<metrcTransfers.length; i++) {
            let metrcTransfer = metrcTransfers[i];

            let used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`[${i+1}/${metrcTransfers.length} (${type})][${new Date().toString()}] Memory usage: ${Math.round(used * 100) / 100} MB`);

            let startTime = process.hrtime();
            await processMetrcTransfer({ metrcTransfer, type, store });

            console.log(`[${i+1}/${metrcTransfers.length} (${type})] Execution time: ${process.hrtime(startTime)[0]}s.`);
        }
    }

    console.log(`Imported ${importedTransferCount} Transfers, created ${newSupplierCount} suppliers`);
};

module.exports = syncTransfers;
