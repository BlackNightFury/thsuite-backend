const { PricingTierWeight } = alias.require('@models');

module.exports = async function(tierWeightId){
    let tierWeight = await PricingTierWeight.findOne({
        where: {
            id: tierWeightId
        }
    });

    if(tierWeight){
        tierWeight.destroy();
    }
}