const {PatientQueue} = alias.require('@models');

module.exports = async function(patientId) {

    let object = await PatientQueue.findOne({
        where: {
            patientId: patientId
        }
    });

    if(object){

        await object.destroy();

        this.broadcast.emit('remove', object.get());
        this.emit('remove', object.get());

    }

}
