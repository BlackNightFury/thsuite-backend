const { PackageUnusedLabel, sequelize } = alias.require('@models');
const moment = require('moment')
const uuid = require('uuid');

module.exports = async function(labelsToImport) {

    const now = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ').toString();

    const labelsInSystem = await sequelize.query( `SELECT Label FROM package_unused_labels
      UNION ALL SELECT Label FROM packages
    `, {
        replacements: [],
        type: sequelize.QueryTypes.SELECT
    });

    let importedLabels = 0;

    for (const label of labelsToImport) {
        if (!labelsInSystem.find(row => row.Label == label)) {
            const packageUnusedLabel = PackageUnusedLabel.build({
                id: uuid.v4(),
                version: 0,
                Label: label,
                createdAt: now,
                updatedAt: now
            });

            try {
                await packageUnusedLabel.save();
                importedLabels += 1;
            } catch (e) {
                // Nothing extremely bad
            }
        }
    }

    if (importedLabels !== labelsToImport.length) {
        throw new Error(`Warning: Failed to import ${labelsToImport.length-importedLabels} Tags out of ${labelsToImport.length}`);
    }

    return importedLabels;
};
