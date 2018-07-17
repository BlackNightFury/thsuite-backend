const { PurchaseOrder, AdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentIds) {

    const adjustments = await PurchaseOrder.findAll({
        where: {
            id: {
                $in: adjustmentIds
            }
        }
    });

    return adjustments.map(adjustment => adjustment.get({plain: true}));
};