
const models = require('../models');


(async function() {

    for(let modelName of Object.keys(models)) {
        if(modelName == 'sequelize' || modelName == 'mysqlPool' || modelName == 'Sequelize')
            continue;


        try {
            await models[modelName].findOne();
        }
        catch(e) {
            console.error('Error in model ' + modelName);
            console.error(e);
            process.exit(1);
        }
    }

})();