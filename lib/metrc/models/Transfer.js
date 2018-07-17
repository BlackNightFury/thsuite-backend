'use strict';

const MetrcModel = require('./MetrcModel');

class Transfer extends MetrcModel {
    
    constructor({
        Id,
        ManifestNumber,
        ShipperFacilityLicenseNumber,
        ShipperFacilityName,
        TransporterFacilityLicenseNumber,
        TransporterFacilityName,
        DriverName,
        DriverOccupationalLicenseNumber,
        DriverVehicleLicenseNumber,
        VehicleMake,
        VehicleModel,
        VehicleLicensePlateNumber,
        DeliveryCount,
        ReceivedDeliveryCount,
        PackageCount,
        ReceivedPackageCount,
        CreatedDateTime,
        CreatedByUserName,
        LastModified,
        DeliveryId,
        RecipientFacilityLicenseNumber,
        RecipientFacilityName,
        ShipmentType,
        EstimatedDepartureDateTime,
        EstimatedArrivalDateTime,
        DeliveryPackageCount,
        DeliveryReceivedPackageCount,
        ReceivedDateTime
    }) {
        super();

        this.Id = Id;
        this.ManifestNumber = ManifestNumber;
        this.ShipperFacilityLicenseNumber = ShipperFacilityLicenseNumber;
        this.ShipperFacilityName = ShipperFacilityName;
        this.TransporterFacilityLicenseNumber = TransporterFacilityLicenseNumber;
        this.TransporterFacilityName = TransporterFacilityName;
        this.DriverName = DriverName;
        this.DriverOccupationalLicenseNumber = DriverOccupationalLicenseNumber;
        this.DriverVehicleLicenseNumber = DriverVehicleLicenseNumber;
        this.VehicleMake = VehicleMake;
        this.VehicleModel = VehicleModel;
        this.VehicleLicensePlateNumber = VehicleLicensePlateNumber;
        this.DeliveryCount = DeliveryCount;
        this.ReceivedDeliveryCount = ReceivedDeliveryCount;
        this.PackageCount = PackageCount;
        this.ReceivedPackageCount = ReceivedPackageCount;
        this.CreatedDateTime = CreatedDateTime;
        this.CreatedByUserName = CreatedByUserName;
        this.LastModified = LastModified;
        this.DeliveryId = DeliveryId;
        this.RecipientFacilityLicenseNumber = RecipientFacilityLicenseNumber;
        this.RecipientFacilityName = RecipientFacilityName;
        this.ShipmentType = ShipmentType;
        this.EstimatedDepartureDateTime = EstimatedDepartureDateTime;
        this.EstimatedArrivalDateTime = EstimatedArrivalDateTime;
        this.DeliveryPackageCount = DeliveryPackageCount;
        this.DeliveryReceivedPackageCount = DeliveryReceivedPackageCount;
        this.ReceivedDateTime = ReceivedDateTime;
        
    }

    static listTransferType(facilityLicense, type) {
        return this.makeRequest('GET', `/transfers/v1/${type}?licenseNumber=${facilityLicense}`)
            .map(transfer => new Transfer(transfer));
    }

    static listDeliveries(facilityLicense, deliveryId) {
        return this.makeRequest('GET', `/transfers/v1/${deliveryId}/deliveries?licenseNumber=${facilityLicense}`)
    }

    static listPackages(facilityLicense, deliveryId) {
        return this.makeRequest('GET', `/transfers/v1/delivery/${deliveryId}/packages?licenseNumber=${facilityLicense}`)
    }
}

module.exports = Transfer;