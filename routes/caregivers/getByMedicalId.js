const {Caregiver} = alias.require('@models');

module.exports = async function(medicalStateId) {

    let caregiver = await Caregiver.findOne( {
        where: {
            medicalStateId: medicalStateId
        }
    } );

    if(caregiver){
        return caregiver.id;
    }else{
        return null;
    }


}


