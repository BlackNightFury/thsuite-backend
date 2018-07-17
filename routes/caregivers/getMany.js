const {Caregiver, PatientCaregiver} = alias.require('@models');
module.exports = async function(caregiverIds) {

    let caregivers = await Caregiver.findAll({
        where: {
            id: {
                $in: caregiverIds
            }
        },
        paranoid: false
    });

    let patientCaregivers = await PatientCaregiver.findAll({
        where: {
            caregiverId: {
                $in: caregiverIds
            }
        }
    });

    let results = [];

    for(let caregiverObj of caregivers){
        let caregiver = caregiverObj.get({plain: true});
        let caregiverId = caregiver.id;
        if(!caregiver.patients){
            caregiver.patients = [];
        }
        for(let pc of patientCaregivers){
            if(pc.caregiverId == caregiverId){
                caregiver.patients.push(pc.patientId);
            }
        }
        results.push(caregiver);
    }

    console.log(results);

    return results;

};
