'use strict';

const MetrcModel = require('./MetrcModel');

class Package extends MetrcModel {

    constructor({
        Id,
        Label,
        PackageType,
        SourceHarvestNames,
        Quantity,
        UnitOfMeasureName,
        UnitOfMeasureAbbreviation,
        ProductId,
        ProductName,
        ProductCategoryName,
        PackagedDate,
        InitialLabTestingState,
        LabTestingState,
        LabTestingStateName,
        LabTestingStateDate,
        IsProductionBatch,
        ProductionBatchNumber,
        IsTestingSample,
        IsProcessValidationTestingSample,
        ProductRequiresRemediation,
        ContainsRemediatedProduct,
        RemediationDate,
        ReceivedFromManifestNumber,
        ReceivedFromFacilityLicenseNumber,
        ReceivedFromFacilityName,
        ReceivedDateTime,
        IsOnHold,
        ArchivedDate,
        FinishedDate,
        LastModified
    }) {
        super();

        this.Id = Id;
        this.Label = Label;
        this.PackageType = PackageType;
        this.SourceHarvestNames = SourceHarvestNames;
        this.Quantity = Quantity;
        this.UnitOfMeasureName = UnitOfMeasureName;
        this.UnitOfMeasureAbbreviation = UnitOfMeasureAbbreviation;
        this.ProductId = ProductId;
        this.ProductName = ProductName;
        this.ProductCategoryName = ProductCategoryName;
        this.PackagedDate = PackagedDate;
        this.InitialLabTestingState = InitialLabTestingState;
        this.LabTestingState = LabTestingState;
        this.LabTestingStateName = LabTestingStateName;
        this.LabTestingStateDate = LabTestingStateDate;
        this.IsProductionBatch = IsProductionBatch;
        this.ProductionBatchNumber = ProductionBatchNumber;
        this.IsTestingSample = IsTestingSample;
        this.IsProcessValidationTestingSample = IsProcessValidationTestingSample;
        this.ProductRequiresRemediation = ProductRequiresRemediation;
        this.ContainsRemediatedProduct = ContainsRemediatedProduct;
        this.RemediationDate = RemediationDate;
        this.ReceivedFromManifestNumber = ReceivedFromManifestNumber;
        this.ReceivedFromFacilityLicenseNumber = ReceivedFromFacilityLicenseNumber;
        this.ReceivedFromFacilityName = ReceivedFromFacilityName;
        this.ReceivedDateTime = ReceivedDateTime;
        this.IsOnHold = IsOnHold;
        this.ArchivedDate = ArchivedDate;
        this.FinishedDate = FinishedDate;
        this.LastModified = LastModified;

    }

    static create(facilityLicense, packages) {
        if(!Array.isArray(packages)) {
            packages = [packages]
        }

        return this.makeRequest('POST', `/packages/v1/create?licenseNumber=${facilityLicense}`, packages);
    }

    static listActive(facilityLicense) {
        return this.makeRequest('GET', `/packages/v1/active?licenseNumber=${facilityLicense}`)
            .map(metrcPackage => new Package(metrcPackage));
    }

    static listOnHold(facilityLicense) {
        return this.makeRequest('GET', `/packages/v1/onhold?licenseNumber=${facilityLicense}`)
            .map(metrcPackage => new Package(metrcPackage));
    }

    static listInactive(facilityLicense) {
        return this.makeRequest('GET', `/packages/v1/inactive?licenseNumber=${facilityLicense}`)
            .map(metrcPackage => new Package(metrcPackage));
    }


    static changeItem(facilityLicense, packages) {
        if(!Array.isArray(packages)) {
            packages = [packages];
        }

        return this.makeRequest('POST', `/packages/v1/change/item?licenseNumber=${facilityLicense}`, packages);
    }
    static adjust(facilityLicense, packages) {
        if(!Array.isArray(packages)) {
            packages = [packages];
        }

        return this.makeRequest('POST', `/packages/v1/adjust?licenseNumber=${facilityLicense}`, packages);
    }
    static finish(facilityLicense, packages) {
        if(!Array.isArray(packages)) {
            packages = [packages];
        }

        return this.makeRequest('POST', `/packages/v1/finish?licenseNumber=${facilityLicense}`, packages);
    }
    static unfinish(facilityLicense, packages) {
        if(!Array.isArray(packages)) {
            packages = [packages];
        }

        return this.makeRequest('POST', `/packages/v1/unfinish?licenseNumber=${facilityLicense}`, packages);
    }

    static getByLabel(facilityLicense, label) {
        return this.makeRequest('GET', `/packages/v1/${label}?licenseNumber=${facilityLicense}`);
    }
}

module.exports = Package;
