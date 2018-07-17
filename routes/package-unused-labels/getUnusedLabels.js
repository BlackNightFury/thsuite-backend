const { PackageUnusedLabel, sequelize } = alias.require('@models');

module.exports = async function() {

    const labels = await sequelize.query( `SELECT l.id
      FROM package_unused_labels l
      LEFT JOIN packages p ON(l.Label = p.Label)
      WHERE p.id IS NULL
    `, {
        replacements: [],
        type: sequelize.QueryTypes.SELECT
    });

    return labels ? labels.map(r => r.id) : undefined;
}
