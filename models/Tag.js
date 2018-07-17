/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Tag', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            field: 'id'
        },
        storeId: {
            type: DataTypes.UUID
        },
        version: {
            type: DataTypes.INTEGER(11),
            field: 'version',
            defaultValue: 0
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'tags',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Store, {
                    foreignKey: 'storeId'
                });
            }
        }
    });
};

/* TODO
queryInterface.addConstraint('Tag', ['storeId', 'value'], {
      type: 'unique',
      name: 'storeId_value_unique_constraint_name'
});
*/
