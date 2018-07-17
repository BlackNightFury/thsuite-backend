/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Item', {
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

        MetrcId: {
            type: DataTypes.INTEGER
        },

        name: {
            type: DataTypes.STRING
        },

        UnitOfMeasureName: {
            type: DataTypes.STRING
        },
        UnitOfMeasureAbbreviation: {
            type: DataTypes.STRING
        },

        productTypeId: {
            type: DataTypes.UUID
        },
        strainId: {
            type: DataTypes.UUID
        },
        thcWeight: {
            type: DataTypes.DECIMAL(8,3)
        }


    }, {
        tableName: 'items',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.ProductType, {
                    foreignKey: 'productTypeId'
                });

                this.belongsTo(db.Store, {
                    foreignKey: 'storeId'
                });

                this.belongsTo(db.Supplier, {
                    foreignKey: 'supplierId'
                });

                this.hasMany(db.Package, {
                    foreignKey: 'itemId'
                });

                this.hasMany(db.ProductVariationItem, {
                    foreignKey: 'itemId'
                });

                this.hasOne(db.Product, {
                    foreignKey: 'itemId'
                });

                this.hasMany(db.BarcodeProductVariationItemPackage, {
                    foreignKey: 'itemId'
                });
            }
        }
    });
};
