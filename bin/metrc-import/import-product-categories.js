
const {ProductType} = alias.require('@models');
const {ItemCategory} = alias.require('@lib/metrc');

const uuid = require('uuid');

module.exports = async function() {

    let categories = await ItemCategory.list();

    let productTypes = categories.map(category => {
        return {
            id: uuid.v4(),
            category: 'cannabis',

            name: category.Name,
            cannabisCategory: category.ProductCategoryType,

            unitOfMeasure: category.QuantityType === 'WeightBased' ? 'gram' : 'each',

            RequiresStrain: category.RequiresStrain,
            RequiresUnitThcContent: category.RequiresUnitThcContent,
            RequiresUnitWeight: category.RequiresUnitWeight,
            CanContainSeeds: category.CanContainSeeds,
            CanBeRemediated: category.CanBeRemediated
        }
    });

    //Add Combined
    productTypes.push({
        id: uuid.v4(),
        category: 'cannabis',

        name: "Combined Category",
        cannabisCategory: "Other",

        unitOfMeasure: "each"

    });

    await ProductType.bulkCreate(productTypes);

    console.log(`Imported ${productTypes.length} Product Types`)
};