require("../../../init");
const config = require('../../../config');
let models = require("../../../models/index");

const uuid = require('uuid');


module.exports = async function() {

    for(let tax of config.metrc.import.taxes) {
        await models.Tax.create({
            id: uuid.v4(),
            name: tax.name,
            percent: tax.percent,
            appliesToCannabis: tax.appliesToCannabis,
            appliesToNonCannabis: tax.appliesToNonCannabis,
        })
    }
};



if(require.main == module) {
    module.exports()
}

