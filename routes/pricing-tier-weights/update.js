const { PricingTierWeight } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(PricingTierWeight, function(existingTierWeight, tierWeight){

    existingTierWeight.pricingTierId = tierWeight.pricingTierId;
    existingTierWeight.weight = tierWeight.weight;
    existingTierWeight.price = tierWeight.price;
    existingTierWeight.readOnly = tierWeight.readOnly;

});