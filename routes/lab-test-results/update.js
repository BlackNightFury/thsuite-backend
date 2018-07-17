const { LabTestResult } = alias.require('@models');
const uuid = require('uuid/v4');

const updateCommon = require('../common/update');

module.exports = updateCommon(LabTestResult, async function(existingLabTestResult, labTestResult){

    existingLabTestResult.id = labTestResult.id;
    existingLabTestResult.packageId = labTestResult.packageId;
    existingLabTestResult.thc = labTestResult.thc || 0;
    existingLabTestResult.thcA = labTestResult.thcA || 0;
    existingLabTestResult.cbd = labTestResult.cbd || 0;
    existingLabTestResult.cbdA = labTestResult.cbdA || 0;
    existingLabTestResult.cbg = labTestResult.cbg || 0;
    existingLabTestResult.cbgA = labTestResult.cbgA || 0;

    existingLabTestResult.potencyUnits = labTestResult.potencyUnits;

    existingLabTestResult.aPinene = labTestResult.aPinene || 0;
    existingLabTestResult.bPinene = labTestResult.bPinene || 0;
    existingLabTestResult.bMyrcene = labTestResult.bMyrcene || 0;
    existingLabTestResult.limonene = labTestResult.limonene || 0;
    existingLabTestResult.terpinolene = labTestResult.terpinolene || 0;
    existingLabTestResult.ocimene = labTestResult.ocimene || 0;
    existingLabTestResult.linalool = labTestResult.linalool || 0;
    existingLabTestResult.bCaryophyllene = labTestResult.bCaryophyllene || 0;
    existingLabTestResult.humulene = labTestResult.humulene || 0;
    existingLabTestResult.bEudesmol = labTestResult.bEudesmol || 0;
    existingLabTestResult.caryophylleneOxide = labTestResult.caryophylleneOxide || 0;
    existingLabTestResult.nerolidol = labTestResult.nerolidol || 0;


});

