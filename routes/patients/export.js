
const { Patient, PatientGroup } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils');

module.exports = async function() {

    //TODO probably should chunk this up
    let data = await Patient.findAll({
        //TODO consider using raw: true
        include: [PatientGroup]
    });

    let reportData = [];

    for(let row of data){
        let reportObj = {
            "Patient Group": row.PatientGroup.name,
            "First Name": row.firstName,
            "Last Name": row.lastName,
            "Medical / State ID": row.medicalStateId,
            "Type": Utils.toTitleCase(row.patientType),
            "Phone Number": row.phoneNumber,
            "Email Address": row.emailAddress,
            "Expiration Date": moment(row.expirationDate).format('LL'),
            // We don't care about timezone on birthday
            "Birthday": moment(row.birthday).format('LL'),
            "Patient Notes": row.patientNotes,
            "Gram Limit": row.gramLimit
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const currentDate = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/patient-export-" + currentDate +  ".csv");

};
