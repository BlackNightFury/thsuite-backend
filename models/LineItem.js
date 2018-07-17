/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('LineItem', {
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

        storeId: {
            type: DataTypes.UUID
        },

        receiptId: {
            type: DataTypes.UUID
        },

        productId: {
            type: DataTypes.UUID
        },
        productVariationId: {
            type: DataTypes.UUID
        },

        discountId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        discountAmount: {
            type: DataTypes.DECIMAL(8, 2)
        },
        wasReturned: {
            default: false,
            type: DataTypes.BOOLEAN
        },
        returnedQuantity: {
            default: 0,
            type: DataTypes.INTEGER,
        },
        barcodeId: {
            type: DataTypes.UUID
        },

        quantity: {
            type: DataTypes.DECIMAL(8, 3)
        },
        price: {
            type: DataTypes.DECIMAL(8, 2)
        },
        isReturn: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'line_items',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Product, {
                    foreignKey: 'productId'
                });
                this.belongsTo(db.ProductVariation, {
                    foreignKey: 'productVariationId'
                });
                
                this.belongsTo(db.Receipt, {
                    foreignKey: 'receiptId'
                })
                 
                this.belongsTo(db.Barcode, {
                    foreignKey: 'barcodeId'
                });
                this.belongsTo(db.Discount, {
                    foreignKey: 'discountId'
                });

                this.hasMany(db.Transaction, {
                    foreignKey: 'lineItemId'
                })
            }
        }
    });
};
