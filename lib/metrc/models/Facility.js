'use strict';

const MetrcModel = require('./MetrcModel');


class Facility extends MetrcModel {

    constructor({
        HomePage,
        HireDate,
        IsManager,
        Occupations,
        Name,
        Alias,
        DisplayName,
        SupportActivationDate,
        SupportExpirationDate,
        SupportLastPaidDate,
        License
    }) {
        super();

        this.HomePage = HomePage;
        this.HireDate = HireDate;
        this.IsManager = IsManager;
        this.Occupations = Occupations;
        this.Name = Name;
        this.Alias = Alias;
        this.DisplayName = DisplayName;
        this.SupportActivationDate = SupportActivationDate;
        this.SupportExpirationDate = SupportExpirationDate;
        this.SupportLastPaidDate = SupportLastPaidDate;
        this.License = License;

    }

    static list() {
        return this.makeRequest('GET', '/facilities/v1')
            .map(facility => new Facility(facility));
    }
}

module.exports = Facility;