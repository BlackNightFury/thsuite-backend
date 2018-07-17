const models = alias.require('@models');

module.exports = async function(patientId) {

    let currentQueue = await models.PatientQueue.findOne({
        order: [
            [ 'createdAt', 'ASC' ]
        ],
        where: {
            patientId: patientId
        },
    });

    return !!currentQueue;
}

