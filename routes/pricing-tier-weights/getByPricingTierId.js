const { PricingTierWeight } = alias.require('@models');


module.exports = async function(pricingTierId){

    let tierWeights = await PricingTierWeight.findAll({
        where: {
            pricingTierId: pricingTierId
        }
    });

    return tierWeights.map(w => w.id);

}