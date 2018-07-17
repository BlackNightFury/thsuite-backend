/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Product', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.UUID
        },
        clientId: {
            type: DataTypes.UUID,
        },

        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        inventoryType: {
            type: DataTypes.ENUM,
            values: ['weight', 'each']
        },

        productTypeId: {
            type: DataTypes.UUID
        },
        itemId:{
            type: DataTypes.UUID
        },
        pricingTierId:{
            type: DataTypes.UUID
        },
        eligibleForDiscount: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        displayOnMenu: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'products',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.ProductType, {
                    foreignKey: 'productTypeId'
                });

                this.belongsTo(db.PricingTier, {
                    foreignKey: 'pricingTierId'
                });

                this.hasMany(db.ProductVariation, {
                    foreignKey: 'productId'
                });

                this.belongsTo(db.Item, {
                    foreignKey: 'itemId'
                });

                this.hasMany(db.Transaction, {
                    foreignKey: 'productId'
                })
            }
        }
    });
};
