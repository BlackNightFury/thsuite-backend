'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('TimeClock', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER(11)
        },
        userId: {
            type: DataTypes.UUID
        },
        clockIn: {
            type: DataTypes.DATE
        },
        clockOut: {
            type: DataTypes.DATE
        },
        autoClockedOut: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'time_clocks',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.User, {
                    foreignKey: 'userId'
                });
            }
        }
    });
}