const { PricingTier } = alias.require('@models');

module.exports = async function(tierId){

    let pricingTier = await PricingTier.findOne({
        where: {
            id: tierId
        }
    });

    return pricingTier.get({plain: true});

}