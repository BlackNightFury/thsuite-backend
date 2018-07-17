'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('EmailSettings', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        userId: {
            type: DataTypes.UUID
        },
        lowInventory: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        autoClosedPackages: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        taxesReport: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'email_settings',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.User, {
                    foreignKey: 'userId'
                });
            }
        }
    })
}