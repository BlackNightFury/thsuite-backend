const {Patient, PatientCaregiver, PatientMedicalCondition} = alias.require('@models');
module.exports = async function(patientId) {

    let patient = await Patient.findOne({
        where: {
            id: patientId
        },
        include: [ PatientMedicalCondition ],
        paranoid: false
    });

    if(!patient) return {};


    patient = patient.get({plain: true});

    if (patient.PatientMedicalConditions && patient.PatientMedicalConditions.length) {
        patient.patientMedicalConditions = patient.PatientMedicalConditions.map(condition => condition.condition);
    } else {
        patient.patientMedicalConditions = [];
    }

    let patientCaregivers = await PatientCaregiver.findAll({
        where: {
            patientId: patient.id
        }
    });

    patient.caregivers = patientCaregivers.map(pc => pc.caregiverId);

    console.log(patient);

    return patient;

    //
    // return object.get({plain: true})
};
