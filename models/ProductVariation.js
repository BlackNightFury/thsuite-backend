/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ProductVariation', {
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

        productId: {
            type: DataTypes.UUID
        },

        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.DECIMAL(8, 2)
        },
        quantity: {
            type: DataTypes.DECIMAL(8, 3)
        },
        readOnly: {
            type: DataTypes.INTEGER
        },
        isBulkFlower: {
            type: DataTypes.BOOLEAN
        }

    }, {
        tableName: 'product_variations',
        classMethods: {
            associate: function(db) {

                this.belongsTo(db.Product, {
                    foreignKey: 'productId'
                });

                this.belongsToMany(db.Item, {
                    foreignKey: 'productVariationId',
                    otherKey: 'itemId',
                    through: db.ProductVariationItem
                });

                this.belongsToMany(db.Tag, {
                    foreignKey: 'productVariationId',
                    otherKey: 'tagId',
                    through: db.TagProductVariation
                });

                this.hasMany(db.ProductVariationItem, {
                    foreignKey: 'productVariationId'
                });

                this.hasMany(db.Barcode, {
                    foreignKey: 'productVariationId'
                });

                this.hasMany(db.BarcodeProductVariationItemPackage, {
                    foreignKey: 'productVariationId'
                });

            }
        }
    });
};
