'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Tax', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER(11)
        },
        name: {
            type: DataTypes.STRING
        },
        percent: {
            type: DataTypes.INTEGER(11)
        },
        appliesToCannabis: {
            type: DataTypes.BOOLEAN
        },
        appliesToNonCannabis: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'taxes',
    });
}