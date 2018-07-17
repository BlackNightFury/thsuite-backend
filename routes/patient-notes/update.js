const { PatientNote } = alias.require('@models');
const updateCommon = require('../common/update');
const uuid = require('uuid');

module.exports = updateCommon(PatientNote, async function(existingPatientNote, patientNote) {
    existingPatientNote.patientId = patientNote.patientId;
    existingPatientNote.authorId = patientNote.authorId;
    existingPatientNote.note = patientNote.note;
});
