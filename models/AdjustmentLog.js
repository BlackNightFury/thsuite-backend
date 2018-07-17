module.exports = function (sequelize, DataTypes) {
    return sequelize.define('AdjustmentLog', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        adjustmentId: {
            type: DataTypes.UUID
        },
        quantityBefore: {
            type: DataTypes.DECIMAL(8, 2)
        },
        quantityAfter: {
            type: DataTypes.DECIMAL(8, 2)
        }
    }, {
        tableName: 'adjustment_logs',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Adjustment, {
                    foreignKey: 'adjustmentId'
                });
            }
        }
    });
};
