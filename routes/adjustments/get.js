const { Adjustment, AdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentId) {

    const adjustment = await Adjustment.findOne({
        include: [ AdjustmentLog ],
        where: {
            id: adjustmentId
        }
    });

    return adjustment.get()
};