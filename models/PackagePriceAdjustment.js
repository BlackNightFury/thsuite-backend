
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PackagePriceAdjustment', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID
        },
        packageId: {
            type: DataTypes.UUID
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        amount: {
            type: DataTypes.DECIMAL(8, 2)
        },
        reason: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        }

    }, {
        tableName: 'package_price_adjustments',
        classMethods: {
            associate: function(db) {

                this.belongsTo(db.Package, {
                    foreignKey: 'packageId'
                });

            }
        }
    });
};
