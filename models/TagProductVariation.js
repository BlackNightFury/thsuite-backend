'use strict';

module.exports = function(sequelize, DataTypes){
    return sequelize.define('TagProductVariation', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        tagId:{
            type: DataTypes.UUID
        },
        productVariationId:{
            type: DataTypes.UUID
        }
    }, {
        tableName: 'tag_product_variations',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.ProductVariation, {
                    foreignKey: 'productVariationId'
                });

                this.belongsTo(db.Tag, {
                    foreignKey: 'tagId'
                });
            }
        }
    })
}
