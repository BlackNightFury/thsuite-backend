const {Patient} = alias.require('@models');
module.exports = async function(args){

    let {patientId, locationUrl} = args;

    if(!patientId){
        throw new Error("Cannot add attestation form to patient. No patient ID specified.")
    }

    if(!locationUrl){
        throw new Error('Cannot add attestation form to patient. No location URL specified.');
    }

    let patient = await Patient.findOne({
        where: {
            id: patientId
        }
    });

    if(!patient){
        throw new Error('Cannot add attestation form to patient. This is not a valid patient ID.');
    }

    patient.attestationForm = locationUrl;

    await patient.save();

    return true;



}
