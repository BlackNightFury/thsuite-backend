/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Barcode', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4, //Removed because it wasn't letting id be set
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        barcode: {
            type: DataTypes.STRING
        },

        productVariationId: {
            type: DataTypes.UUID
        },

        allocatedInventory: {
            type: DataTypes.INTEGER(11)
        },

        remainingInventory: {
            type: DataTypes.INTEGER(11)
        }

    }, {
        tableName: 'barcodes',
        classMethods: {
            associate: function(db) {

                this.hasMany(db.BarcodeProductVariationItemPackage, {
                    foreignKey: 'barcodeId'
                });

                this.belongsTo(db.ProductVariation, {
                    foreignKey: 'productVariationId'
                });


            }
        },
        hooks: {
            afterSave: async function(barcode, options) {

                const {Alert, Barcode, Item} = sequelize.models;


                let totalBarcodeQuantity = await Barcode.aggregate('remainingInventory', 'SUM', {
                    where: {
                        productVariationId: barcode.productVariationId
                    },
                    transaction: options.transaction
                });

                if(totalBarcodeQuantity > 20) { //TODO change hard coded value
                    await Alert.destroy({
                        where: {
                            type: 'barcode-low-inventory',
                            entityId: barcode.productVariationId
                        },
                        transaction: options.transaction
                    });
                }
                else {

                    let productVariation = await barcode.getProductVariation();
                    let product = await productVariation.getProduct();

                    let [alert, created] = await Alert.findOrCreate({
                        where: {
                            type: 'product-variation-low-inventory',
                            entityId: productVariation.id
                        },
                        defaults: {
                            title: 'Low Product Variation Inventory',
                            description: `Product Variation ${product.name} ${productVariation.name} has low inventory`,
                            url: `/admin/inventory/products/edit/${product.id}/variations/edit/${productVariation.id}`
                        },
                        transaction: options.transaction
                    });

                    //TODO send alert email if created
                }
            }
        }
    });
};
