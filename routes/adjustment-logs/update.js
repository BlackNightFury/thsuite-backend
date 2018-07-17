const { AdjustmentLog } = alias.require('@models');
const updateCommon = require('../common/update');
const uuid = require('uuid');

module.exports = updateCommon(AdjustmentLog, async function(existingAdjustmentLog, adjustmentLog) {
    existingAdjustmentLog.adjustmentId = adjustmentLog.adjustmentId;
    existingAdjustmentLog.quantityBefore = adjustmentLog.quantityBefore;
    existingAdjustmentLog.quantityAfter = adjustmentLog.quantityAfter;
});