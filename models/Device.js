module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Device', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.UUID,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        name: {
            type: DataTypes.STRING
        }

    }, {
        tableName: 'devices',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Store, {
                    foreignKey: 'storeId'
                });
            }
        }
    });
};
