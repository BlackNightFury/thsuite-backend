const { Patient, PatientGroup, PatientMedicalCondition } = alias.require('@models');
const moment = require('moment');
const uuid = require('uuid/v4');
const io = require('../../lib/io');

module.exports = async function(patient) {

    let existingPatient = await Patient.find({
        where: {
            id: patient.id,
        }
    });

    if(!existingPatient) {
        existingPatient = Patient.build({});
    }

    let isNewRecord = existingPatient.isNewRecord;

    if(!isNewRecord) {
        // if(existingObject.version !== object.version) {
        //     throw new Error("Version mismatch");
        // }

        patient.version++;
    }

    let patientsGroup = await PatientGroup.findOne({
        where: {
            name: 'Patients'
        }
    });

    console.log('patient birthday', existingPatient.birthday);
    console.log('new patient birthday', patient.birthday);
    console.log('new patient birthday date', moment.utc(patient.birthday, (patient.birthday && patient.birthday.length === 9 ? "M/DD/YYYY" : undefined)).format('YYYY-MM-DD').toString());

    let patientsGroupId = patientsGroup.id;

    existingPatient.id = patient.id;
    existingPatient.version = patient.version;

    existingPatient.firstName = patient.firstName;
    existingPatient.lastName = patient.lastName;
    existingPatient.patientType = patient.patientType;
    existingPatient.patientGroupId = patient.patientGroupId ? patient.patientGroupId : patientsGroupId;
    existingPatient.medicalStateId = patient.medicalStateId;
    existingPatient.expirationDate = moment.utc(patient.expirationDate, (patient.expirationDate && patient.expirationDate.length === 9 ? "M/DD/YYYY" : undefined)).format('YYYY-MM-DD').toString();
    // We don't care timezone on birthday saving so save exact date as was submitted from the frontend
    existingPatient.birthday = moment.utc(patient.birthday, (patient.birthday && patient.birthday.length === 9 ? "M/DD/YYYY" : undefined)).format('YYYY-MM-DD').toString();
    existingPatient.phoneNumber = patient.phoneNumber;
    existingPatient.emailAddress = patient.emailAddress;
    existingPatient.state = patient.state;
    existingPatient.zip = patient.zip;
    existingPatient.city = patient.city;
    existingPatient.county = patient.county;
    existingPatient.address = patient.address;
    existingPatient.gramLimit = patient.gramLimit;
    existingPatient.referrer = patient.referrer;
    // existingPatient.patientNotes = patient.patientNotes;

    //Emit loyalty update
    let loyaltyPointsUpdated = patient.loyaltyPoints != existingPatient.loyaltyPoints;

    existingPatient.loyaltyPoints = patient.loyaltyPoints;

    existingPatient.driversLicenseId = patient.driversLicenseId;
    existingPatient.passportId = patient.passportId;
    existingPatient.otherStateId = patient.otherStateId;
    existingPatient.amountRemaining = patient.amountRemaining;
    existingPatient.physicianId = patient.physicianId;
    existingPatient.idImage = patient.idImage;
    existingPatient.attestationForm = patient.attestationForm;

    // let promise = updatePropertiesCallback(existingPatient, patient);
    //
    // if (promise && promise.then) {
    //     await promise;
    // }

    await existingPatient.save();

    if (patient.medicalCondition && !Array.isArray(patient.medicalCondition) && !patient.patientMedicalConditions) {
        patient.patientMedicalConditions = [patient.medicalCondition];
    }

    const currentPatientMedicalConditions = await PatientMedicalCondition.findAll( { where: { patientId: patient.id }} );
    let patientConditionsUpdated = true;

    // Update patient conditions only if really needed
    if (patient.patientMedicalConditions && patient.patientMedicalConditions.length) {
        patientConditionsUpdated = false;
        if (patient.patientMedicalConditions.length !== currentPatientMedicalConditions.length) {
            patientConditionsUpdated = true;4
        } else {
            for (const condition of currentPatientMedicalConditions) {
               if (patient.patientMedicalConditions.indexOf(condition.condition) < 0) {
                   patientConditionsUpdated = true;
                   break;
               }
            }

            if (!patientConditionsUpdated) {
                for (const condition of patient.patientMedicalConditions) {
                    if (!currentPatientMedicalConditions.some(currentCondition => currentCondition.condition == condition)) {
                        patientConditionsUpdated = true;
                        break;
                    }
                }
            }
        }
    }

    if (patientConditionsUpdated) {
        await PatientMedicalCondition.destroy( { where: { patientId: patient.id }} );
        if (!Array.isArray(patient.patientMedicalConditions)) {
            patient.patientMedicalConditions = [patient.patientMedicalConditions];
        }

        for (const condition of patient.patientMedicalConditions) {
            if (condition){
                await PatientMedicalCondition.create({ id: uuid(), patientId: patient.id, condition: condition });
            }
        }
    }

    const patientData = existingPatient.get();

    if (patient.patientMedicalConditions && patient.patientMedicalConditions.length) {
        patientData.patientMedicalConditions = patient.patientMedicalConditions.map(condition => condition);
    } else {
        patientData.patientMedicalConditions = [];
    }

    if(isNewRecord) {
        io.of('/patients').emit('create', patientData);
    } else {
        if(loyaltyPointsUpdated){
            if(patientData.medicalStateId) {
                io.of('/patients').emit('loyalty-update', {
                    id: patientData.id,
                    medicalStateId: patientData.medicalStateId,
                    loyaltyPoints: patientData.loyaltyPoints
                });
            }
        }

        io.of('/patients').emit('update', patientData);
    }

    return existingPatient
};
