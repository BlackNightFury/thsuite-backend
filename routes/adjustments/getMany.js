const { Adjustment, AdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentIds) {

    const adjustments = await Adjustment.findAll({
        include: [ AdjustmentLog ],
        where: {
            id: {
                $in: adjustmentIds
            }
        }
    });

    return adjustments.map(adjustment => adjustment.get({plain: true}));
};