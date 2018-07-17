const MetrcModel = require('../../lib/metrc/models/MetrcModel');
const { Patient } = alias.require('@models');
const config = require('../../config');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
require('moment-timezone');

sgMail.setApiKey(config.sendGrid);

function formatPatientMedicalId(id){
    let medicalIdRegex = '.{1,4}'; // Regex used to group patient IDs
    let medicalIdSeparator = '-';

    let value = id.replace(/[^a-zA-Z0-9]/g, '');

    let regex = new RegExp(medicalIdRegex, 'g');

    if(!value.match(regex)){
        return value;
    }

    return value.match(regex).join(medicalIdSeparator);
}

const LOG_PREFIX = '[getByPatientMedicalId]';
const log = (timestamp, msg) => {
    if(typeof msg == 'string'){
        console.log(`${LOG_PREFIX}-${timestamp} -- ${msg}`);
    }else{
        console.log(`${LOG_PREFIX}-${timestamp} -- ${JSON.stringify(msg)}`);
    }
}
module.exports = async function(medicalId, licenseNumber){

    const cartLimits = {
        cartMax: 0,
        // buds: 0,
        /*
        // All other types are merged together into cartMax
        shakeTrim: 0,
        plants: 0,
        infusedNonEdible: 0,
        infusedEdible: 0,
        concentrate: 0
        */
    };

    let timestamp = moment().format('X');

    // If all parameters are sent as object in the first argument
    if (typeof medicalId === 'object') {
        licenseNumber = medicalId.licenseNumber;
        medicalId = medicalId.medicalId;
    }

    if (!licenseNumber || !medicalId) {
        throw new Error('Too few arguments, expected licenseNumber and medicalId');
    }

    const patient = await Patient.findOne({
        where: {
            $or: [
                {
                    medicalStateId: medicalId.replace(/\-/g, '')
                },
                {
                    medicalStateId: medicalId
                }
            ]
        }
    });

    if (!patient) {
        return cartLimits;
    }

    // log(timestamp, `PATIENT ID: ${patient.id}`);

    //TODO: Enabled 07/12/2018 due to Metrc disabling endpoint, remove when endpoint is re-enabled

    //Always set cartMax to saved gramLimit
    cartLimits.cartMax = patient.gramLimit;

    //TODO: Disabled 07/12/2018 due to Metrc disabling endpoint, uncomment when endpoint is re-enabled
    // If the last gram limit update happened in the last 10 minutes
    // if (patient.gramLimit && patient.gramLimitUpdatedAt && moment.utc(patient.gramLimitUpdatedAt).add(10, 'minutes').isAfter(moment.utc())) {
    //     log(timestamp, `PATIENT HAD GRAM LIMIT UPDATED RECENTLY. RETURNING ${patient.gramLimit}`)
    //     cartLimits.cartMax = patient.gramLimit;
    // } else {
    //     // For testing use METRC_PATIENT_SANDBOX=1 pm2 reload APP_NAME --update-env
    //     if (process.env.METRC_PATIENT_SANDBOX) {
    //         medicalId = 'P04M-DD31-DD60-0B44';
    //         licenseNumber = 'D-17-X0001';
    //     }
    //
    //     try {
    //         // Medical id always must have dashes
    //         medicalId = formatPatientMedicalId(medicalId);
    //
    //         log(timestamp, `PATIENT MED ID: ${medicalId}`);
    //
    //         log(timestamp, `MAKING REQUEST TO METRC`);
    //
    //         // https://api-md.metrc.com/Documentation#Patients.get_patients_v1_status_{patientLicenseNumber}
    //         const response = await MetrcModel.makeRequest('GET', `/patients/v1/status/${medicalId}?licenseNumber=${licenseNumber}`);
    //         console.log('response', medicalId, licenseNumber, response);
    //
    //         if (!response) {
    //             log(timestamp, 'NO RESPONSE FROM METRC');
    //             throw new Error('Failed to get patient thc limit');
    //         }
    //
    //         log(timestamp, 'METRC RESPONSE');
    //         log(timestamp, response);
    //
    //         const ounces = parseFloat(response.ThcOuncesAvailable);
    //         cartLimits.cartMax = parseFloat(Math.floor((ounces*28.3495231)*100)/100);
    //
    //         log(timestamp, `OUNCES: ${ounces}`);
    //         log(timestamp, `CART MAX: ${cartLimits.cartMax}`);
    //
    //         if (patient && response.ThcOuncesAvailable && cartLimits.cartMax && cartLimits.cartMax > 0) {
    //             log(timestamp, `RESPONSE WAS VALID -- NO EMAIL`);
    //             patient.gramLimit = cartLimits.cartMax;
    //             patient.gramLimitUpdatedAt = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ').toString();
    //             log(timestamp, 'PATIENT RECORD');
    //             log(timestamp, patient);
    //
    //             await patient.save();
    //         }
    //
    //     } catch(e) {
    //         // TODO: better error maybe notify administrator that something is wrong?
    //         console.error(e);
    //         log(timestamp, `ERROR IN TRY: ${e.message}`);
    //         cartLimits.cartMax = patient.gramLimit;
    //         if(config.environment.patientGramLimitUpdateFailure){
    //             log(timestamp, `SENDING EMAIL`);
    //             let mailResult = await sgMail.send( {
    //                 to: config.environment.patientGramLimitUpdateFailure.length ? config.environment.patientGramLimitUpdateFailure : ['joe@thsuite.com', 'simon@thsuite.com'],
    //                 from: 'noreply@thsuite.com',
    //                 subject: `Patient gram limit update failure -- ${LOG_PREFIX}`,
    //                 html: `
    //             <div>Supplied arguments: ${JSON.stringify({medicalId, licenseNumber})}</div>
    //             <br>
    //             <div>Patient Medical ID supplied to Metrc: ${formatPatientMedicalId(patient.medicalStateId)}</div>
    //             <br>
    //             <div>Log Timestamp: ${timestamp}</div>
    //             <br>
    //             <div>Error generated from ${LOG_PREFIX}. Search logs for ${LOG_PREFIX}-${timestamp}</div>
    //             `
    //             } );
    //         }
    //     }
    // }

    return cartLimits
}
