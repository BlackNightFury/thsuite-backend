const {Patient} = alias.require('@models');
module.exports = async function(args){

    if(!args.patientId && !args.medicalStateId){
        throw new Error('Unable to update patient loyalty points. patientId or medicalStateId must be specified');
    }

    let patient;

    if(args.patientId){
        patient = await Patient.findOne({
            where: {
                id: args.patientId
            }
        });

        if(!patient && !args.medicalStateId){
            throw new Error('Unable to find patient using patientId');
        }
    }else if(args.medicalStateId){

        patient = await Patient.findOne({
            where: {
                $or: [
                    {
                        medicalStateId: args.medicalStateId.replace(/\-/g, '')
                    },
                    {
                        medicalStateId: args.medicalStateId
                    }
                ]
            }
        });

    }

    if(!patient){
        throw new Error('Unable to find patient with supplied patientId/medicalStateId');
    }

    if(!args.loyaltyPoints && args.loyaltyPoints != 0){
        throw new Error('Unable to update loyalty points. No loyaltyPoints value specified');
    }

    patient.loyaltyPoints = args.loyaltyPoints;

    await patient.save();

    this.broadcast.emit('update', patient.get());

    return true;

}
