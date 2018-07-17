/* jshint indent: 2 */

//TODO: add constraints on email, phoneNumber
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Physician', {
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
        phoneNumber: {
            type: DataTypes.STRING
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        clinicName: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        },
    }, {
        tableName: 'physicians',
        classMethods: {
            associate: function(db) {
            },
        }
    });
};
