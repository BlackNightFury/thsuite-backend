'use strict';

const MetrcModel = require('./MetrcModel');

class PlantBatch extends MetrcModel {
    
    constructor({
        Id,
        Name,
        Type,
        StrainId,
        StrainName,
        Count,
        LiveCount,
        PackagedCount,
        HarvestedCount,
        DestroyedCount,
        SourcePackageId,
        SourcePackageLabel,
        SourcePlantId,
        SourcePlantLabel,
        PlantedDate,
        LastModified
    }) {
        super();

        this.Id = Id;
        this.Name = Name;
        this.Type = Type;
        this.StrainId = StrainId;
        this.StrainName = StrainName;
        this.Count = Count;
        this.LiveCount = LiveCount;
        this.PackagedCount = PackagedCount;
        this.HarvestedCount = HarvestedCount;
        this.DestroyedCount = DestroyedCount;
        this.SourcePackageId = SourcePackageId;
        this.SourcePackageLabel = SourcePackageLabel;
        this.SourcePlantId = SourcePlantId;
        this.SourcePlantLabel = SourcePlantLabel;
        this.PlantedDate = PlantedDate;
        this.LastModified = LastModified;
    }


    static createPlantings(facilityLicense, plantBatches) {
        if(!Array.isArray(plantBatches)) {
            plantBatches = [plantBatches];
        }

        return this.makeRequest('POST', `/plantbatches/v1/createplantings?licenseNumber=${facilityLicense}`, plantBatches);
    }

    static createPackages(facilityLicense, packages){
        if(!Array.isArray(packages)) {
            packages = [packages];
        }

        return this.makeRequest('POST', `/plantbatches/v1/createpackages?licenseNumber=${facilityLicense}`, packages);
    }

    static changeGrowthPhase(facilityLicense, plantBatches){
        if(!Array.isArray(plantBatches)) {
            plantBatches = [plantBatches];
        }

        return this.makeRequest('POST', `/plantbatches/v1/changegrowthphase?licenseNumber=${facilityLicense}`, plantBatches);
    }

    static destroy(facilityLicense, plantBatches){
        if(!Array.isArray(plantBatches)) {
            plantBatches = [plantBatches];
        }

        return this.makeRequest('POST', `/plantbatches/v1/destroy?licenseNumber=${facilityLicense}`, plantBatches);
    }
}

module.exports = PlantBatch;