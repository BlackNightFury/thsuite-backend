/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Store', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            // defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            field: 'id'
        },
        version: {
            type: DataTypes.INTEGER(11),
            field: 'version'
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'name'
        },
        metrcName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'metrcName'
        },
        metricAlias: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'metricAlias'
        },
        licenseType: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'licenseType'
        },
        licenseNumber: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'licenseNumber'
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'city'
        },
        state: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'state'
        },
        storeManager: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'storeManager'
        },
        taxesIncluded: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'taxesIncluded'
        },
        timeZone: {
            type: DataTypes.STRING,
            field: 'timeZone'
        }
    }, {
        tableName: 'stores',
        classMethods: {
            associate: function(db) {
                this.hasOne(db.StoreSettings, {
                    foreignKey: 'storeId'
                });
            }
        }
    });
};
