require('../init');

const uuid = require('uuid/v4');
const config = require('../config');
const { Patient, PatientMedicalCondition } = alias.require('@models');

module.exports = async () => {

    const patients = await Patient.findAll({});

    for (const patient of patients) {
        if (patient.medicalCondition) {
            await PatientMedicalCondition.destroy( { where: { patientId: patient.id }} );
            await PatientMedicalCondition.create({ id: uuid(), patientId: patient.id, condition: patient.medicalCondition });
        }
    };
};

if (require.main == module) {
    module.exports();
}
