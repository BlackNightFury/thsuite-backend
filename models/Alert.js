
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Alert', {
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


        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        entityId: {
            type: DataTypes.UUID
        }

    }, {
        tableName: 'alerts',
        classMethods: {
            associate: function(db) {


            }
        }
    });
};
