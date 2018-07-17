'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Printer', {
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
        deviceProxyId: {
            type: DataTypes.UUID
        },
        port: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        isEnabled: {
            type: DataTypes.BOOLEAN
        }
    },{
        tableName: 'printers'
    });
};