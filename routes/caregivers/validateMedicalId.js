const {Caregiver} = alias.require('@models');

module.exports = async function(args) {

    let {medicalStateId, caregiverId} = args;

    let caregiver = await Caregiver.findOne( {
        where: {
            id: {
                $not: caregiverId
            },
            medicalStateId: medicalStateId
        }
    } );

    return !caregiver;


}



