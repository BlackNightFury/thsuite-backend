const { AdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentLogId) {

    const adjustmentLog = await AdjustmentLog.findOne({
        where: {
            id: adjustmentLogId
        }
    });

    return adjustmentLog.get()
};