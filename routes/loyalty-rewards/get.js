
const {LoyaltyReward, ProductVariation} = alias.require('@models');

module.exports = async function(loyaltyRewardId){

    let loyaltyReward = await LoyaltyReward.findOne({
        where: {
            id: loyaltyRewardId
        },
        // include: [
        //     {
        //         model: ProductVariation,
        //         attributes: ['id']
        //     }
        // ]
    });

    return loyaltyReward.get({plain: true});

}
