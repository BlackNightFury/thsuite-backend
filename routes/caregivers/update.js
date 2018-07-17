const { Caregiver} = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Caregiver, async function(existingCaregiver, caregiver) {
    existingCaregiver.firstName = caregiver.firstName;
    existingCaregiver.lastName = caregiver.lastName;
    existingCaregiver.medicalStateId = caregiver.medicalStateId;
    existingCaregiver.emailAddress = caregiver.emailAddress;
    existingCaregiver.phoneNumber = caregiver.phoneNumber;
    existingCaregiver.birthday = caregiver.birthday;
});
