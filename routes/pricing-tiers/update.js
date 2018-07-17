const { PricingTier } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(PricingTier, function(existingTier, tier){
    existingTier.name = tier.name;
    existingTier.description = tier.description;
    existingTier.mode = tier.mode;
})