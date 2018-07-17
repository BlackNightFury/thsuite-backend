/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Client', {
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
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
    }, {
        tableName: 'clients',
        classMethods: {
            associate: function(db) {

            }
        }
    });
};
