/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PatientGroup', {
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
        description: {
            type: DataTypes.TEXT
        },
    }, {
        tableName: 'patient_groups',
        classMethods: {
            associate: function(db) {

            }
        }
    });
};
