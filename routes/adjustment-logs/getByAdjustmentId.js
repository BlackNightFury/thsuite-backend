const { AdjustmentLog } = alias.require('@models');

module.exports = async function(adjustmentId) {

    let adjustmentLog = await AdjustmentLog.findOne({
        where: {
            adjustmentId: adjustmentId
        }
    });

    return adjustmentLog ? adjustmentLog.get() : null;
};