'use strict';

const MetrcModel = require('./MetrcModel');

class Item extends MetrcModel{

    constructor({
        Id,
        Name,
        ProductCategoryName,
        ProductCategoryType,
        QuantityType,
        UnitOfMeasureId,
        UnitOfMeasureName,
        UnitOfMeasureAbbreviation,
        StrainId,
        StrainName,
        UnitThcContent,
        UnitThcContentUnitOfMeasureId,
        UnitThcContentUnitOfMeasureName,
        UnitThcContentUnitOfMeasureAbbreviation,
        UnitWeight,
        UnitWeightUnitOfMeasureId,
        UnitWeightUnitOfMeasureName,
        UnitWeightUnitOfMeasureAbbreviation
    }) {
        super();

        this.Id = Id;
        this.Name = Name;
        this.ProductCategoryName = ProductCategoryName;
        this.ProductCategoryType = ProductCategoryType;
        this.QuantityType = QuantityType;
        this.UnitOfMeasureId = UnitOfMeasureId;
        this.UnitOfMeasureName = UnitOfMeasureName;
        this.UnitOfMeasureAbbreviation = UnitOfMeasureAbbreviation;
        this.StrainId = StrainId;
        this.StrainName = StrainName;
        this.UnitThcContent = UnitThcContent;
        this.UnitThcContentUnitOfMeasureId = UnitThcContentUnitOfMeasureId;
        this.UnitThcContentUnitOfMeasureName = UnitThcContentUnitOfMeasureName;
        this.UnitThcContentUnitOfMeasureAbbreviation = UnitThcContentUnitOfMeasureAbbreviation;
        this.UnitWeight = UnitWeight;
        this.UnitWeightUnitOfMeasureId = UnitWeightUnitOfMeasureId;
        this.UnitWeightUnitOfMeasureName = UnitWeightUnitOfMeasureName;
        this.UnitWeightUnitOfMeasureAbbreviation = UnitWeightUnitOfMeasureAbbreviation;
    }

    static get(id) {
        return this.makeRequest('GET', `/items/v1/${id}`)
            .then(item => new Item(item))
    }

    static listActive(facilityLicense) {
        return this.makeRequest('GET', `/items/v1/active?licenseNumber=${facilityLicense}`);
    }

    static create(facilityLicense, items) {
        if(!Array.isArray(items)) {
            items = [items]
        }

        return this.makeRequest('POST', `/items/v1/create?licenseNumber=${facilityLicense}`, items)
    }

    static update(facilityLicense, items) {
        if(!Array.isArray(items)) {
            items = [items]
        }

        return this.makeRequest('POST', `/items/v1/update?licenseNumber=${facilityLicense}`, items)
    }

    static delete(facilityLicense, id) {
        return this.makeRequest('DELETE', `/items/v1/${id}?licenseNumber=${facilityLicense}`)
    }
}

module.exports = Item;