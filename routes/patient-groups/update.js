
const { PatientGroup } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(PatientGroup, function(existingGroup, patientGroup) {

    existingGroup.name = patientGroup.name;
    existingGroup.description = patientGroup.description;

});