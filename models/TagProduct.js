'use strict';

module.exports = function(sequelize, DataTypes){
    return sequelize.define('TagProduct', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        tagId:{
            type: DataTypes.UUID
        },
        productId:{
            type: DataTypes.UUID
        }
    }, {
        tableName: 'tag_products',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.Product, {
                    foreignKey: 'productId'
                });

                this.belongsTo(db.Tag, {
                    foreignKey: 'tagId'
                });
            }
        }
    })
}
