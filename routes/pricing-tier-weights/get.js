const { PricingTierWeight } = alias.require('@models');

module.exports = async function(tierWeightId){

    let pricingTierWeight = await PricingTierWeight.findOne({
        where: {
            id: tierWeightId
        }
    });

    return pricingTierWeight.get({plain: true});

}