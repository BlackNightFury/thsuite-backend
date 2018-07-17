const {Patient} = alias.require('@models');
const io = require('../../lib/io');
module.exports = async function(args){

    let {patientId, medicalId} = args;

    let patient = await Patient.findOne({
        where: {
            id: patientId
        }
    });

    if(!patient) return false;

    patient.medicalStateId = medicalId;

    await patient.save();

    io.of('/patients').emit('update', patient.get());

    return true;

}

