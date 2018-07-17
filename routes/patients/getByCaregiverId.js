const {Patient, PatientCaregiver} = alias.require('@models');

module.exports = async function({ caregiverId }) {

    const patients = [];
    const patientCaregivers = await PatientCaregiver.findAll({
        where: { caregiverId }
    });

    for (const patientCaregiver of patientCaregivers) {
        const patient = await Patient.findOne({
            include: [ PatientMedicalCondition ],
            where: {
                id: patientCaregiver.patientId
            }
        });

        patients.push(patient.toJSON());
    }

    return patients;
};
