require("../../../init");
let models = require("../../../models/index");
const uuid = require('uuid');

module.exports = async function() {

    await models.PatientGroup.bulkCreate([
        {
            id: uuid.v4(),
            name: 'Patients',
            description: 'Default Group'
        },
        {
            id: uuid.v4(),
            name: 'Employees',
            description: 'Default Group'
        },
    ]);

}