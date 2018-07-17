'use strict';

class Patient {

    constructor({
        PatientId,
        LicenseNumber,
        RegistrationDate,
        LicenseEffectiveStartDate,
        LicenseEffectiveEndDate,
        RecommendPlants,
        RecommendedSmokableQuantity,
        OtherFacilitiesCount
    }) {
        this.PatientId = PatientId;
        this.LicenseNumber = LicenseNumber;
        this.RegistrationDate = RegistrationDate;
        this.LicenseEffectiveStartDate = LicenseEffectiveStartDate;
        this.LicenseEffectiveEndDate = LicenseEffectiveEndDate;
        this.RecommendPlants = RecommendPlants;
        this.RecommendedSmokableQuantity = RecommendedSmokableQuantity;
        this.OtherFacilitiesCount = OtherFacilitiesCount;
    }
}

module.exports = Patient;