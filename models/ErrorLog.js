module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ErrorLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING
        },
        stack: {
            type: DataTypes.STRING
        },
        component: {
            type: DataTypes.STRING
        }

    }, {
        tableName: 'error_logs',
        classMethods: {
            associate: function(db) {
            }
        }
    });
};
