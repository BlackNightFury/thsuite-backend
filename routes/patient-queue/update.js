
const { PatientQueue } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(PatientQueue, async function(existingPatientQueue, patientQueue) {
    existingPatientQueue.patientId = patientQueue.patientId;
    existingPatientQueue.caregiverId = patientQueue.caregiverId;
    existingPatientQueue.budtenderId = patientQueue.budtenderId;
    existingPatientQueue.cartOpen = patientQueue.cartOpen;
    existingPatientQueue.source = patientQueue.source;
    existingPatientQueue.verifiedAt = patientQueue.verifiedAt;
    existingPatientQueue.enteredAt = patientQueue.enteredAt;
});
