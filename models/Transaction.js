/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Transaction', {
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
        lineItemId: {
            type: DataTypes.UUID
        },

        packageId: {
            type: DataTypes.UUID
        },
        barcodeProductVariationItemPackageId: {
            type: DataTypes.UUID
        },
        productId: {
            type: DataTypes.UUID
        },
        productVariationId: {
            type: DataTypes.UUID
        },

        itemId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        discountId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        discountAmount: {
            type: DataTypes.DECIMAL(8, 2)
        },
        isReturn: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        returnedQuantity: {
            default: 0,
            type: DataTypes.INTEGER,
        },
        wasReturned: {
            default: false,
            type: DataTypes.BOOLEAN
        },
        transactionDate: {
            type: DataTypes.DATE
        },
        PackageLabel: {
            type: DataTypes.STRING
        },
        QuantitySold: {
            type: DataTypes.DECIMAL(8, 3)
        },
        TotalPrice: {
            type: DataTypes.DECIMAL(8, 2)
        },


        SalesDeliveryState: {
            type: DataTypes.STRING
        },

        ArchivedDate: {
            type: DataTypes.DATE
        },
        LastModified: {
            type: DataTypes.DATE
        },

        sentToMetrc: {
            type: DataTypes.BOOLEAN
        }

    }, {
        tableName: 'transactions',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Product, {
                    foreignKey: 'productId'
                });
                this.belongsTo(db.Package, {
                    foreignKey: 'packageId'
                });
                this.belongsTo(db.Item, {
                    foreignKey: 'itemId'
                });

                this.belongsTo(db.Receipt, {
                    foreignKey: 'receiptId'
                });

                this.belongsTo(db.LineItem, {
                    foreignKey: 'lineItemId'
                });

                this.hasMany(db.TransactionTax, {
                    foreignKey: 'transactionId'
                });

                this.belongsTo(db.Discount, {
                    foreignKey: 'discountId'
                });
            }
        }
    });
};
