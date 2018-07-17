const { Tax } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Tax, function(existingTax, tax) {

    existingTax.id = tax.id;
    existingTax.version = tax.version;
    existingTax.name = tax.name;

    existingTax.percent = tax.percent;

    existingTax.appliesToCannabis = tax.appliesToCannabis;
    existingTax.appliesToNonCannabis = tax.appliesToNonCannabis;

});