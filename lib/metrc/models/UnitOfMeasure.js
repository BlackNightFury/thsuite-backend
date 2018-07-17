'use strict';

class UnitOfMeasure {

    constructor({
        QuantityType,
        Name,
        Abbreviation
    }) {

        this.QuantityType = QuantityType;
        this.Name = Name;
        this.Abbreviation = Abbreviation;

    }
}

module.exports = UnitOfMeasure;