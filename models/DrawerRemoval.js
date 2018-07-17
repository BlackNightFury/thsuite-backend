module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DrawerRemoval', {

        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        drawerId: {
            type: DataTypes.UUID,
        },
        userId: {
            type: DataTypes.UUID
        },
        removedAmount: {
            type: DataTypes.DECIMAL(8, 2)
        }
    }, {
        tableName: 'drawer_removals',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Drawer, {
                    foreignKey: 'drawerId'
                });
                this.belongsTo(db.User, {
                    foreignKey: 'userId'
                });
            }
        }
    });
};
