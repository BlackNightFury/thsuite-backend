require("../init");


let models = require("../models");

const Metrc = require("../lib/metrc");

(async function() {

    let categories = await Metrc.ItemCategory.list();

    let productTypes = categories.map(category => {
        return {
            category: 'cannabis',
            cannabisCategory: category.ProductCategoryType,
            name: category.Name,
            unitOfMeasure: category.Name.indexOf('(each)') == -1 ? 'gram' : 'each',
            notes: ''
        }
    });

    await models.ProductType.bulkCreate(productTypes);

})().catch(err => console.error(err));