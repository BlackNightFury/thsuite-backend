/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ProductVariationItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },

        productVariationId: {
            type: DataTypes.UUID
        },
        itemId: {
            type: DataTypes.UUID
        },

        quantity: {
            type: DataTypes.DECIMAL(8, 3)
        },

    }, {
        tableName: 'product_variation_items',
        classMethods: {
            associate: function(db) {

                this.belongsTo(db.ProductVariation, {
                    foreignKey: 'productVariationId'
                });

                this.belongsTo(db.Item, {
                    foreignKey: 'itemId'
                });

            }
        }
    });
};
