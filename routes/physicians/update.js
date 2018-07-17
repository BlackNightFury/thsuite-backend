const { Physician } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Physician, async function(existingPhysician, physician) {
    existingPhysician.firstName = physician.firstName;
    existingPhysician.lastName = physician.lastName;
    existingPhysician.emailAddress = physician.emailAddress;
    existingPhysician.phoneNumber = physician.phoneNumber;
    existingPhysician.clinicName = physician.clinicName;
    existingPhysician.address = physician.address;
    existingPhysician.city = physician.city;
    existingPhysician.state = physician.state;
    existingPhysician.zip = physician.zip;
});
