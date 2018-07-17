const {Patient, PatientCaregiver, PatientMedicalCondition} = alias.require('@models');
module.exports = async function(patientIds) {

    let patients = await Patient.findAll({
        where: {
            id: {
                $in: patientIds
            }
        },
        include: [ PatientMedicalCondition ],
        paranoid: false
    });

    let patientCaregivers = await PatientCaregiver.findAll({
        where: {
            patientId: {
                $in: patientIds
            }
        }
    });

    let results = [];

    for(let patientObj of patients){
        let patient = patientObj.get({plain: true});
        let patientId = patient.id;
        if(!patient.caregivers){
            patient.caregivers = [];
        }
        for(let pc of patientCaregivers){
            if(pc.patientId == patientId){
                patient.caregivers.push(pc.caregiverId);
            }
        }

        if (patientObj.PatientMedicalConditions && patientObj.PatientMedicalConditions.length) {
            patient.patientMedicalConditions = patientObj.PatientMedicalConditions.map(condition => condition.condition);
        } else {
            patient.patientMedicalConditions = [];
        }

        results.push(patient);
    }

    console.log(results);

    return results;

};
