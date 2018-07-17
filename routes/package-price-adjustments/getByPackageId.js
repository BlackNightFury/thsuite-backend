const { PackagePriceAdjustment } = alias.require('@models');


module.exports = async function(packageId) {

    let adjustments = await PackagePriceAdjustment.findAll({
        where: {
            packageId: packageId
        },
        order:[['date', 'ASC']]
    });

    return adjustments.map(a => a.id);
};