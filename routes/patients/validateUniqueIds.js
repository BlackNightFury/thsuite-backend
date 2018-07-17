const {Patient} = alias.require('@models');
module.exports = async function(args){

    let {ids, patientId} = args;

    let fieldToReadableMap = {
        'medicalStateId' : "Medical State ID",
        'driversLicenseId': "Driver's License ID",
        'passportId': "Passport ID",
        'otherStateId': "Other State ID",
        'emailAddress': "Email Address"
    };

    let nonUniqueFields = {};

    for(let idField of Object.keys(ids)){

        if(!fieldToReadableMap[idField]){
            throw new Error(`Unknown patient ID field specified: ${idField}`);
        }

        let idValue = ids[idField];
        let where = {
            id: {
                $not: patientId
            }
        };
        where[idField] = idValue;


        let patient = await Patient.findOne({
            where: where
        });

        if(patient){
            nonUniqueFields[idField] = fieldToReadableMap[idField];
        }

    }

    let unique = !Object.keys(nonUniqueFields).length;

    return {unique, nonUniqueFields};

}
