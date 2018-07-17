
const { PackageUnusedLabel } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(PackageUnusedLabel, function(existingLabel, label) {

    existingLabel.id = label.id;
    existingLabel.version = label.version;
    existingLabel.Label = label.Label;
});
