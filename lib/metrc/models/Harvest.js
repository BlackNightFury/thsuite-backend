'use strict';

const MetrcModel = require('./MetrcModel');

class Harvest extends MetrcModel {

    constructor({
        Id,
        Name,
        HarvestType,
        DryingRoomId,
        DryingRoomName,
        CurrentWeight,
        TotalWasteWeight,
        PlantCount,
        TotalWetWeight,
        PackageCount,
        TotalPackagedWeight,
        UnitOfWeightName,
        LabTestingState,
        LabTestingStateDate,
        IsOnHold,
        HarvestStartDate,
        FinishedDate,
        ArchivedDate,
        LastModified,
        Strains
    }) {
        super();

        this.Id = Id;
        this.Name = Name;
        this.HarvestType = HarvestType;
        this.DryingRoomId = DryingRoomId;
        this.DryingRoomName = DryingRoomName;
        this.CurrentWeight = CurrentWeight;
        this.TotalWasteWeight = TotalWasteWeight;
        this.PlantCount = PlantCount;
        this.TotalWetWeight = TotalWetWeight;
        this.PackageCount = PackageCount;
        this.TotalPackagedWeight = TotalPackagedWeight;
        this.UnitOfWeightName = UnitOfWeightName;
        this.LabTestingState = LabTestingState;
        this.LabTestingStateDate = LabTestingStateDate;
        this.IsOnHold = IsOnHold;
        this.HarvestStartDate = HarvestStartDate;
        this.FinishedDate = FinishedDate;
        this.ArchivedDate = ArchivedDate;
        this.LastModified = LastModified;
        this.Strains = Strains;

    }

    static get(id) {
        return this.makeRequest('GET', `/harvests/v1/${id}`)
            .then(harvest => new Harvest(harvest));
    }

    static listActive(facilityLicense) {
        return this.makeRequest('GET', `/harvests/v1/active?licenseNumber=${facilityLicense}`)
            .map(harvest => new Harvest(harvest))
    }

    static createPackages(facilityLicense, packages){
        if(!Array.isArray(packages)) {
            packages = [packages];
        }
        return this.makeRequest('POST', `/harvests/v1/createpackages?licenseNumber=${facilityLicense}`, packages);

    }

    static removeWaste(facilityLicense, harvests){
        if(!Array.isArray(harvests)) {
            harvests = [harvests];
        }
        return this.makeRequest('POST', `/harvests/v1/removewaste?licenseNumber=${facilityLicense}`, harvests);
    }

    static finish(facilityLicense, harvests){
        if(!Array.isArray(harvests)) {
            harvests = [harvests];
        }
        return this.makeRequest('POST', `/harvests/v1/finish?licenseNumber=${facilityLicense}`, harvests);
    }

    static unfinish(facilityLicense, harvests){
        if(!Array.isArray(harvests)) {
            harvests = [harvests];
        }
        return this.makeRequest('POST', `/harvests/v1/unfinish?licenseNumber=${facilityLicense}`, harvests);
    }
}

module.exports = Harvest;