const {Patient} = alias.require('@models');
const io = require('../../lib/io');
module.exports = async function(args){

    let {patientId, gramLimit} = args;

    let patient = await Patient.findOne({
        where: {
            id: patientId
        }
    });

    if(!patient) return false;

    patient.gramLimit = gramLimit;

    await patient.save();

    io.of('/patients').emit('update', patient.get());

    return true;

}
