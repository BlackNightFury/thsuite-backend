const models = alias.require('@models');

module.exports = async function(patientId) {

    let currentQueue = await models.PatientQueue.findAll( {
      order: [ [ 'createdAt', 'ASC' ] ],
      where: { enteredAt: null }
    } )

    console.log(currentQueue);

    let index = currentQueue.findIndex( row => row.patientId == patientId )
    if( index != -1 ) index += 1

    return index
}
