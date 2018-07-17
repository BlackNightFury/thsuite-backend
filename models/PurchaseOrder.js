
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PurchaseOrder', {
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
        itemId: {
            type: DataTypes.UUID
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        amount: {
            type: DataTypes.DECIMAL(8, 2)
        },
        price: {
            type: DataTypes.DECIMAL(8, 2)
        },
        notes: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        }

    }, {
        tableName: 'purchase_orders',
        classMethods: {
            associate: function(db) {

                this.belongsTo(db.Package, {
                    foreignKey: 'packageId'
                });

                this.belongsTo(db.User, {
                    foreignKey: 'userId'
                });

                this.hasOne(db.AdjustmentLog, {
                    foreignKey: 'adjustmentId'
                });

            }
        }
    });
};
