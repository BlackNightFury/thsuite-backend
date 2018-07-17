const { ReceiptAdjustment, ReceiptAdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentIds) {

    const adjustments = await ReceiptAdjustment.findAll({
        include: [ ReceiptAdjustmentLog ],
        where: {
            id: {
                $in: adjustmentIds
            }
        }
    });

    return adjustments.map(adjustment => adjustment.get({plain: true}));
};