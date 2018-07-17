'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('DeviceProxy', {
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
            type:DataTypes.STRING
        },
    },{
        tableName: 'device_proxies'
    });
};