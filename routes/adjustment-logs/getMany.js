const { AdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentLogIds) {

    const adjustmentLogs = await AdjustmentLog.findAll({
        where: {
            id: {
                $in: adjustmentLogIds
            }
        }
    });

    return adjustmentLogs.map(adjustmentLog => adjustmentLog.get({plain: true}));
};