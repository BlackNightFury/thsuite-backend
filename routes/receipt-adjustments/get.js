const { ReceiptAdjustment, ReceiptAdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentId) {

    let adjustment = await ReceiptAdjustment.findOne({
        include: [ ReceiptAdjustmentLog ],
        where: {
            id: adjustmentId
        }
    });

    return adjustment.get()
};