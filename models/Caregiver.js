/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Caregiver', {
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
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        medicalStateId: {
            type: DataTypes.STRING
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        birthday: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'caregivers',
        classMethods: {
            associate: function(db) {

            },
        }
    });
};
