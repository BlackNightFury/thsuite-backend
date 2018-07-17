const {PatientQueue} = alias.require('@models');

module.exports = async function(patientId) {

    const queue = await PatientQueue.findOne( {
        where: {
            patientId: patientId
        }
    } );

    return queue ? queue.id : null;
}
