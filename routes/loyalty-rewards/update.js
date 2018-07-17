const { LoyaltyReward, LoyaltyRewardTag } = alias.require('@models');
const uuid = require('uuid/v4')

const updateCommon = require('../common/update');

module.exports = updateCommon(LoyaltyReward, async function(existingLoyaltyReward, loyaltyReward){

   existingLoyaltyReward.id = loyaltyReward.id;
   existingLoyaltyReward.version = loyaltyReward.version;

   existingLoyaltyReward.name = loyaltyReward.name;
   existingLoyaltyReward.points = loyaltyReward.points;

   existingLoyaltyReward.discountAmountType = loyaltyReward.discountAmountType;
   existingLoyaltyReward.discountAmount = loyaltyReward.discountAmount;

   existingLoyaltyReward.appliesTo = loyaltyReward.appliesTo;
   existingLoyaltyReward.numItems = loyaltyReward.numItems;
   existingLoyaltyReward.isActive = loyaltyReward.isActive;

   if(loyaltyReward.Tags){
      await LoyaltyRewardTag.destroy({
          where: {
             loyaltyRewardId: loyaltyReward.id
          }
      });

      await Promise.all( loyaltyReward.Tags.map( async tag => {
         console.log(tag)
         console.log(loyaltyReward.id)
         return LoyaltyRewardTag.create( {
             id: uuid(),
             loyaltyRewardId: loyaltyReward.id,
             tagId: tag.id
         } )
      } ) )
   }
});
