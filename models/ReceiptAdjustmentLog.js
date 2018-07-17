module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ReceiptAdjustmentLog', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        receiptAdjustmentId: {
            type: DataTypes.UUID
        },
        quantityBefore: {
            type: DataTypes.DECIMAL(8, 2)
        },
        quantityAfter: {
            type: DataTypes.DECIMAL(8, 2)
        }
    }, {
        tableName: 'receipt_adjustment_logs',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.ReceiptAdjustment, {
                    foreignKey: 'receiptAdjustmentId'
                });
            }
        }
    });
};