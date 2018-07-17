const {PatientNote} = alias.require('@models');

module.exports = async function(patientId) {

    let notes = await PatientNote.findAll( {
        where: {
            patientId: patientId
        },
        order: [['createdAt', 'DESC']]
    } );

    return notes.map(n => n.id);

}


