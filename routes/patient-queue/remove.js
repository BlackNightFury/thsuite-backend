const {PatientQueue} = alias.require('@models');

module.exports = async function(patientQueueId) {

    let object = await PatientQueue.findOne({
        where: {
            id: patientQueueId
        }
    });

    await object.destroy();

    this.broadcast.emit('remove', object.get());
    this.emit('remove', object.get());

}


