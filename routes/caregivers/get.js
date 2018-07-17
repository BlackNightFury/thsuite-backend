const {Caregiver, PatientCaregiver} = alias.require('@models');
module.exports = async function(caregiverId) {

    let caregiver = await Caregiver.findOne({
        where: {
            id: caregiverId
        },
        paranoid: false
    });

    if(!caregiver) return {};


    caregiver = caregiver.get({plain: true});

    let patientCaregivers = await PatientCaregiver.findAll({
        where: {
            caregiverId: caregiver.id
        }
    });

    caregiver.patients = patientCaregivers.map(pc => pc.patientId);

    console.log(caregiver);

    return caregiver;

    //
    // return object.get({plain: true})
};



