
const { PackagePriceAdjustment } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(PackagePriceAdjustment, function(existingAdjustment, adjustment) {

    existingAdjustment.userId = adjustment.userId;
    existingAdjustment.packageId = adjustment.packageId;
    existingAdjustment.amount = adjustment.amount;
    existingAdjustment.reason = adjustment.reason;
    existingAdjustment.notes = adjustment.notes;
    existingAdjustment.date = adjustment.date;


});