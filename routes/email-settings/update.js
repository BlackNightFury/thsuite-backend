const { EmailSettings } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(EmailSettings, function(existingEmailSettings, emailSettings) {

    existingEmailSettings.userId = emailSettings.userId;
    existingEmailSettings.lowInventory = emailSettings.lowInventory;
    existingEmailSettings.autoClosedPackages = emailSettings.autoClosedPackages;
    existingEmailSettings.taxesReport = emailSettings.taxesReport;


});