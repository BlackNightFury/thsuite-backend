module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DrawerLog', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        drawerId: {
            type: DataTypes.UUID,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        event: {
            type: DataTypes.STRING
        }

    }, {
        tableName: 'drawer_logs',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Drawer, {
                    foreignKey: 'drawerId'
                });
            }
        }
    });
};
