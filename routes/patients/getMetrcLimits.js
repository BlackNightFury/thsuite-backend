const MetrcModel = require('../../lib/metrc/models/MetrcModel');
const { Patient } = alias.require('@models');
const config = require('../../config');

function formatPatientMedicalId(id){
    let medicalIdRegex = '.{1,4}'; //Regex used to group patient IDs
    let medicalIdSeparator = '-';

    let value = id.replace(/[^a-zA-Z0-9]/g, '');

    let regex = new RegExp(medicalIdRegex, 'g');

    if(!value.match(regex)){
        return value;
    }

    return value.match(regex).join(medicalIdSeparator);
}

module.exports = async function(args){

    let licenseNumber = args.licenseNumber;
    let medicalId = args.medicalId;

    if(!licenseNumber || !medicalId){
        throw new Error('Unable to pull limits from Metrc. Missing parameters');
    }

    try{
        medicalId = formatPatientMedicalId(medicalId);
        const response = await MetrcModel.makeRequest('GET', `/patients/v1/status/${medicalId}?licenseNumber=${licenseNumber}`);

        if(!response){
            throw new Error("Metrc responded with nothing. Please double check patient's medical ID");
        }

        return response;
    }catch(e){
        console.log("error getting metrc limits in getMetrcLimit");
        console.log(e.message);
        throw new Error(`Unable to pull limits from Metrc. There was an error making the request to Metrc`);
    }

}
