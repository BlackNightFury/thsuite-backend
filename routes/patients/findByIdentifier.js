

const models = alias.require('@models');

module.exports = async function(args) {

    let patient = await models.Patient.findOne({
        attributes: ['id'],

        where: {
            $or: {
                emailAddress: args.identifier,
                medicalStateId: args.identifier,
                otherStateId: args.identifier,
                passportId: args.identifier,
                driversLicenseId: args.identifier,
            }
        },

    });

    if(patient){
        return patient.id;
    }else{
        return null;
    }
}
