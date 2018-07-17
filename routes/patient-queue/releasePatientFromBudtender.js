const {PatientQueue} = alias.require('@models');

module.exports = async function(patientId) {

    const object = await PatientQueue.findOne({
        where: {
            patientId: patientId
        }
    });

    if (object){

        object.openCart = null;
        object.budtenderId = null;

        await object.save();

        this.broadcast.emit('update', object.get());
        this.emit('update', object.get());
    }
}
