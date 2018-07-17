/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ProductType', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        clientId: {
            type: DataTypes.UUID,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        category: {
            type: DataTypes.ENUM,
            values: ['cannabis', 'non-cannabis']
        },

        name: {
            type: DataTypes.STRING
        },
        cannabisCategory: {
            type: DataTypes.ENUM,
            values: ['Buds', 'ShakeTrim', 'Plants', 'Other', 'InfusedNonEdible', 'InfusedEdible', 'Concentrate', 'NonCannabis']
        },

        unitOfMeasure: {
            type: DataTypes.ENUM,
            values: ['gram', 'each']
        },

        RequiresStrain: {
            type: DataTypes.BOOLEAN
        },
        RequiresUnitThcContent: {
            type: DataTypes.BOOLEAN
        },
        RequiresUnitWeight: {
            type: DataTypes.BOOLEAN
        },
        CanContainSeeds: {
            type: DataTypes.BOOLEAN
        },
        CanBeRemediated: {
            type: DataTypes.BOOLEAN
        },

        notes: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {
        tableName: 'product_types',
        classMethods: {
            associate: function(db) {
                this.hasMany(db.Product, {
                    foreignKey: 'productTypeId'
                })
            }
        }
    });
};
