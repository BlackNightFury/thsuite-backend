'use strict';


const Metrc = require("../lib/metrc");


(async function() {

    let categories = await Metrc.ItemCategory.list();

    // let map = {};
    // categories.forEach(category => {
    //     if(!map[category.ProductCategoryType]) {
    //         map[category.ProductCategoryType] = [];
    //     }
    //
    //     map[category.ProductCategoryType].push(category.Name);
    // });

    console.log(categories);

})().catch(console.error.bind(console)).then(process.exit);