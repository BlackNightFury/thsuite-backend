/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Strain', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        clientId: {
            type: DataTypes.UUID,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        name: {
            type: DataTypes.STRING
        },
        MetrcId: {
            type: DataTypes.INTEGER
        }

    }, {
        tableName: 'strains',
        classMethods: {
            associate: function(db) {
            }
        }
    });
};
