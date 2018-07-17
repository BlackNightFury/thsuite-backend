'use strict';

const MetrcModel = require("./MetrcModel");

class Strain extends MetrcModel {

    constructor({
        Id,
        Name,
        TestingStatus,
        ThcLevel,
        CbdLevel,
        IndicaPercentage,
        SativaPercentage,
        Genetics
    }) {
        super();

        this.Id = Id;
        this.Name = Name;
        this.TestingStatus = TestingStatus;
        this.ThcLevel = ThcLevel;
        this.CbdLevel = CbdLevel;
        this.IndicaPercentage = IndicaPercentage;
        this.SativaPercentage = SativaPercentage;
        this.Genetics = Genetics;
    }

    static get(id) {
        return this.makeRequest('GET', `/strains/v1/${id}`)
            .then(strain => new Strain(strain))
    }

    static listActive(facilityLicense) {
        return this.makeRequest('GET', `/strains/v1/active?licenseNumber=${facilityLicense}`);
    }

    static create(facilityLicense, strains) {
        if(!Array.isArray(strains)) {
            strains = [strains];
        }

        return this.makeRequest('POST', `/strains/v1/create?licenseNumber=${facilityLicense}`, strains);
    }

    static update(facilityLicense, strains) {
        if(!Array.isArray(strains)) {
            strains = [strains];
        }

        return this.makeRequest('POST', `/strains/v1/update?licenseNumber=${facilityLicense}`, strains);
    }

    static delete(facilityLicense, id) {
        return this.makeRequest('DELETE', `/strains/v1/${id}?licenseNumber=${facilityLicense}`)
    }

}

module.exports = Strain;