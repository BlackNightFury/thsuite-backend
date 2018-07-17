const {Patient, PatientQueue, Store, PatientCaregiver, PatientMedicalCondition} = alias.require('@models');
const MetrcModel = require('../../lib/metrc/models/MetrcModel');
const uuid = require('uuid');
const io = require('../../lib/io');
const moment = require('moment');
const sgMail = require('@sendgrid/mail');
const config = require('../../config');
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

const LOG_PREFIX = '[addToQueue]';
const log = (timestamp, msg) => {
    if(typeof msg == 'string'){
        console.log(`${LOG_PREFIX}-${timestamp} -- ${msg}`);
    }else{
        console.log(`${LOG_PREFIX}-${timestamp} -- ${JSON.stringify(msg)}`);
    }
};
module.exports = async function(args){

    let patientId = args.patientId;

    let caregiverId;

    if(args.caregiverId){
        caregiverId = args.caregiverId;
    }else{
        caregiverId = null;
    }
    let source = null;
    if(args.source){
        source = args.source;
    }

    let patient = await Patient.findOne({
        include: [ PatientMedicalCondition ],
        where: {
            id: patientId
        }
    });

    if(!patient){
        throw new Error("Unable to add to queue. Patient does not exist");
    }

    // Check if already in queue

    let queueSpot = await PatientQueue.findOne({
        where: {
            patientId: patientId
        }
    });

    if(queueSpot){
        throw new Error("Unable to add to queue. Patient is already in queue.");
    }

    let patientCartLimitUpdated = false;
    let timestamp = moment().format('X');

    //TODO: Disabled 07/12/2018 due to Metrc disabling endpoint, uncomment when endpoint is re-enabled
    // if (true || args.storeId) {
    //     const store = await Store.findOne({
    //         attributes: [ 'licenseNumber' ],
    //     // where: { id: args.storeId } TODO add check for storeId
    //     });
    //
    //     log(timestamp, `STORE LICENSE: ${store.licenseNumber}`);
    //
    //     if (store) {
    //         try {
    //             // Medical id always must have dashes
    //             let medicalId = formatPatientMedicalId(patient.medicalStateId);
    //             let response;
    //
    //             log(timestamp, `PATIENT MED ID: ${medicalId}`);
    //             log(timestamp, `MAKING REQUEST TO METRC`);
    //
    //             // Use METRC_PATIENT_SANDBOX=1 pm2 reload APP_NAME --update-env
    //             if (process.env.METRC_PATIENT_SANDBOX) {
    //                 response = await MetrcModel.makeRequest('GET', `/patients/v1/status/P04M-DD31-DD60-0B44?licenseNumber=D-17-X0001`);
    //             } else {
    //                 // https://api-md.metrc.com/Documentation#Patients.get_patients_v1_status_{patientLicenseNumber}
    //                 response = await MetrcModel.makeRequest('GET', `/patients/v1/status/${medicalId}?licenseNumber=${store.licenseNumber}`);
    //             }
    //
    //             if (!response) {
    //                 log(timestamp, 'NO RESPONSE FROM METRC');
    //                 throw new Error('Failed to get patient thc limit');
    //             }
    //
    //             log(timestamp, 'METRC RESPONSE');
    //             log(timestamp, response);
    //
    //             const ounces = parseFloat(response.ThcOuncesAvailable);
    //             const cartMax = parseFloat(Math.floor((ounces*28.3495231)*100)/100);
    //
    //             log(timestamp, `OUNCES: ${ounces}`);
    //             log(timestamp, `CART MAX: ${cartMax}`);
    //
    //             if (response.ThcOuncesAvailable && cartMax && cartMax > 0) {
    //                 log(timestamp, `RESPONSE WAS VALID -- NO EMAIL`);
    //                 // Patient will be saved later
    //                 patient.gramLimit = cartMax;
    //                 patient.gramLimitUpdatedAt = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ').toString();
    //
    //                 log(timestamp, 'PATIENT RECORD');
    //                 log(timestamp, patient);
    //
    //                 patientCartLimitUpdated = true;
    //             }
    //
    //         } catch(e) {
    //             console.error(e);
    //             log(timestamp, `ERROR IN TRY: ${e.message}`);
    //         }
    //     }
    // }

    // if (!patientCartLimitUpdated) {
    //     if (config.environment.patientGramLimitUpdateFailure){
    //         log(timestamp, `SENDING EMAIL`);
    //         let mailResult = await sgMail.send( {
    //             to: config.environment.patientGramLimitUpdateFailure.length ? config.environment.patientGramLimitUpdateFailure : ['joe@thsuite.com', 'simon@thsuite.com'],
    //             from: 'noreply@thsuite.com',
    //             subject: `Patient gram limit update failure -- ${LOG_PREFIX}`,
    //             html: `
    //             <div>Supplied arguments: ${JSON.stringify(args)}</div>
    //             <br>
    //             <div>Patient Medical ID supplied to Metrc: ${formatPatientMedicalId(patient.medicalStateId)}</div>
    //             <br>
    //             <div>Log Timestamp: ${timestamp}</div>
    //             <br>
    //             <div>Error generated from ${LOG_PREFIX}. Search logs for ${LOG_PREFIX}-${timestamp}</div>
    //             `
    //         } );
    //     } else {
    //         console.error(`Oops! Patient gram limit update failed. Supplied arguments: ${JSON.stringify(args)}`);
    //     }
    // }

    let patientQueueId = uuid.v4();

    let object = await PatientQueue.create({
        id: patientQueueId,
        version: 0,
        patientId: patientId,
        caregiverId: caregiverId,
        budtenderId: null,
        source: source,
        verifiedAt: args.verifyAndEnter ? args.verifyAndEnter : null,
        enteredAt: args.verifyAndEnter ? args.verifyAndEnter: null
    });

    //Add patient caregiver record
    if(caregiverId) {
        let patientCaregiver = await PatientCaregiver.findOne({
            where: {
                patientId,
                caregiverId
            }
        });

        if (!patientCaregiver) {

            await PatientCaregiver.create({
                id: uuid.v4(),
                patientId: patientId,
                caregiverId: caregiverId
            });

        }
    }

    log(timestamp, `PATIENT QUEUE RECORD CREATED WITH ID: ${patientQueueId}`);

    console.log("broadcasting!");
    console.log(object.get());

    io.of('/patient-queue').emit('create', object.get());
    // Note: Don't know why this wasn't working, but client that sent update wasn't refreshing
    // this.broadcast.emit('create', object.get());

    let now = new Date();

    if(!patient.firstTimeInQueue){
        patient.firstTimeInQueue = now;
    }

    patient.lastAddedToQueue = now;

    await patient.save();

    log(timestamp, 'PATIENT SAVED');

    const patientData = patient.get();

    if (patient.PatientMedicalConditions && patient.PatientMedicalConditions.length) {
        patientData.patientMedicalConditions = patient.PatientMedicalConditions.map(condition => condition.condition);
    } else {
        patientData.patientMedicalConditions = [];
    }

    io.of('/patients').emit('update', patientData);

    return patientQueueId;

}
