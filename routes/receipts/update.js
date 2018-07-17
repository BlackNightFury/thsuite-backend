
const { Patient } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Patient, function(existingPatient, patient) {

    existingPatient.firstName = patient.firstName;
    existingPatient.lastName = patient.lastName;
    existingPatient.patientType = patient.patientType;
    existingPatient.patientGroupId = patient.patientGroupId;
    existingPatient.medicalStateId = patient.medicalStateId;
    existingPatient.expirationDate = patient.expirationDate;
    existingPatient.birthday = patient.birthday;
    existingPatient.phoneNumber = patient.phoneNumber;
    existingPatient.emailAddress = patient.emailAddress;
    existingPatient.patientNotes = patient.patientNotes;

});