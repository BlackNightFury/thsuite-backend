'use strict';

const MetrcModel = require('./MetrcModel');

class ItemCategory extends MetrcModel{

    constructor({
        Name,
        ProductCategoryType,
        QuantityType,
        RequiresStrain,
        RequiresUnitThcContent,
        RequiresUnitWeight,
        CanContainSeeds,
        CanBeRemediated
    }) {
        super();
        
        this.Name = Name;
        this.ProductCategoryType = ProductCategoryType;
        this.QuantityType = QuantityType;
        this.RequiresStrain = RequiresStrain;
        this.RequiresUnitThcContent = RequiresUnitThcContent;
        this.RequiresUnitWeight = RequiresUnitWeight;
        this.CanContainSeeds = CanContainSeeds;
        this.CanBeRemediated = CanBeRemediated;
    }


    static list() {
        return this.makeRequest('GET', `/items/v1/categories`)
            .map(item => new ItemCategory(item))
    }
}

module.exports = ItemCategory;