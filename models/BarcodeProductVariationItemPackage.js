/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('BarcodeProductVariationItemPackage', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        barcodeId:{
            type: DataTypes.UUID
        },
        productVariationId: {
            type: DataTypes.UUID
        },
        itemId: {
            type: DataTypes.UUID
        },

        packageId: {
            type: DataTypes.UUID
        }

    }, {
        tableName: 'barcode_product_variation_item_packages',
        classMethods: {
            associate: function(db) {

                this.belongsTo(db.Barcode, {
                    foreignKey: 'barcodeId'
                });

                this.belongsTo(db.ProductVariation, {
                    foreignKey: 'productVariationId'
                });

                this.belongsTo(db.Item, {
                    foreignKey: 'itemId'
                });

                this.belongsTo(db.Package, {
                    foreignKey: 'packageId'
                });

            }
        }
    });
};

