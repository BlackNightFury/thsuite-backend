const { ReceiptAdjustment, ReceiptAdjustmentLog, Package } = alias.require('@models');
const updateCommon = require('../common/update');
const uuid = require('uuid');

module.exports = updateCommon(ReceiptAdjustment, async function(existingAdjustment, adjustment) {

    existingAdjustment.userId = adjustment.userId;
    existingAdjustment.packageId = adjustment.packageId;
    existingAdjustment.receiptId = adjustment.receiptId;
    existingAdjustment.amount = adjustment.amount;
    existingAdjustment.reason = adjustment.reason;
    existingAdjustment.notes = adjustment.notes;
    existingAdjustment.date = adjustment.date;

    if (existingAdjustment.isNewRecord) {

        const _package = await Package.findOne({
            attributes: ['id', 'Quantity'],
            where: {
                id: adjustment.packageId
            }
        });

        if (_package && _package.id) {
            const log = ReceiptAdjustmentLog.build({});

            log.id = uuid.v4();
            log.receiptAdjustmentId = existingAdjustment.id;
            log.quantityBefore = _package.Quantity;
            log.quantityAfter = _package.Quantity + adjustment.amount;

            await log.save();
        }
    }
});