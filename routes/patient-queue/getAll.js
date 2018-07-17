const {PatientQueue} = alias.require('@models');

module.exports = async function() {

    let queues = await PatientQueue.findAll( {
        order: [['enteredAt', 'ASC']]
    } );

    return queues.map(queue => queue.id);

}


