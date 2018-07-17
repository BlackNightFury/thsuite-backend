const { PackagePriceAdjustment } = alias.require('@models');


module.exports = async function(adjustmentId) {

    let adjustment = await PackagePriceAdjustment.findOne({
        where: {
            id: adjustmentId
        }
    });

    return adjustment.get()
};