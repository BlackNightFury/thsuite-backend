/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Customer', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points:{
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        tableName: 'customers',
        classMethods: {
            associate: function(db) {

                // this.belongsTo(db.Item, {
                //     foreignKey: 'itemId'
                // })

            }
        }
    });
};
