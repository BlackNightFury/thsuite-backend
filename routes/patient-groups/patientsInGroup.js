
const { Patient } = alias.require('@models');

module.exports = async function(patientGroupId){

    let patients = await Patient.findAll({
        where: {
            patientGroupId: patientGroupId
        }
    });

    return !!patients.length;

}