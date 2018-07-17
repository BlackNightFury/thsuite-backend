'use strict';

const MetrcModel = require('./MetrcModel');

class Plant extends MetrcModel {

    constructor({
        Id,
        Label,
        State,
        GrowthPhase,
        PlantBatchId,
        PlantBatchName,
        PlantBatchTypeName,
        StrainId,
        StrainName,
        RoomId,
        RoomName,
        HarvestId,
        HarvestedUnitOfWeightName,
        HarvestedUnitOfWeightAbbreviation,
        HarvestedWetWeight,
        HarvestCount,
        IsOnHold,
        PlantedDate,
        VegetativeDate,
        FloweringDate,
        HarvestedDate,
        LastModified
    }) {
        super();

        this.Id = Id;
        this.Label = Label;
        this.State = State;
        this.GrowthPhase = GrowthPhase;
        this.PlantBatchId = PlantBatchId;
        this.PlantBatchName = PlantBatchName;
        this.PlantBatchTypeName = PlantBatchTypeName;
        this.StrainId = StrainId;
        this.StrainName = StrainName;
        this.RoomId = RoomId;
        this.RoomName = RoomName;
        this.HarvestId = HarvestId;
        this.HarvestedUnitOfWeightName = HarvestedUnitOfWeightName;
        this.HarvestedUnitOfWeightAbbreviation = HarvestedUnitOfWeightAbbreviation;
        this.HarvestedWetWeight = HarvestedWetWeight;
        this.HarvestCount = HarvestCount;
        this.IsOnHold = IsOnHold;
        this.PlantedDate = PlantedDate;
        this.VegetativeDate = VegetativeDate;
        this.FloweringDate = FloweringDate;
        this.HarvestedDate = HarvestedDate;
        this.LastModified = LastModified;
    }

    static get(id) {
        return this.makeRequest('GET', `/plants/v1/${id}`)
            .then(plant => new Plant(plant));
    }

    static create(facilityLicense, plants) {
        if(!Array.isArray(plants)) {
            plants = [plants];
        }
        return this.makeRequest('POST', `/plants/v1/create/plantings?licenseNumber=${facilityLicense}`, plants);
    }

    static move(facilityLicense, plants) {
        if(!Array.isArray(plants)) {
            plants = [plants];
        }
        return this.makeRequest('POST', `/plants/v1/moveplants?licenseNumber=${facilityLicense}`, plants);
    }

    static changeGrowthPhase(facilityLicense, plants){
        if(!Array.isArray(plants)) {
            plants = [plants];
        }
        return this.makeRequest('POST', `/plants/v1/changegrowthphases?licenseNumber=${facilityLicense}`, plants);
    }

    static manicure(facilityLicense, plants){
        if(!Array.isArray(plants)) {
            plants = [plants];
        }
        return this.makeRequest('POST', `/plants/v1/manicureplants?licenseNumber=${facilityLicense}`, plants);
    }

    static harvest(facilityLicense, plants){
        if(!Array.isArray(plants)) {
            plants = [plants];
        }
        return this.makeRequest('POST', `/plants/v1/harvestplants?licenseNumber=${facilityLicense}`, plants);
    }

    static destroy(facilityLicense, plants){
        if(!Array.isArray(plants)) {
            plants = [plants];
        }
        return this.makeRequest('POST', `/plants/v1/destroyplants?licenseNumber=${facilityLicense}`, plants);
    }

}

module.exports = Plant;