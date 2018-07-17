const models = require("../models");
const config = require('../config');

if(config.sequelize.allowSync) {
    models.sequelize.sync({force: true});
}
else {
    console.log("Sync is not enabled for this environment");
}