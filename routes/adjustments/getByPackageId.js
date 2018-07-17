const { Adjustment } = alias.require('@models');

module.exports = async function(packageId) {

    let adjustments = await Adjustment.findAll({
        attributes: ['id'],
        where: {
            packageId: packageId
        },
        order:[['date', 'ASC']]
    });

    return adjustments.map(a => a.id);
};