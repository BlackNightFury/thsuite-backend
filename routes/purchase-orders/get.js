const { PurchaseOrder, AdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentId) {

    const adjustment = await PurchaseOrder.findOne({
        where: {
            id: adjustmentId
        }
    });

    return adjustment.get()
};