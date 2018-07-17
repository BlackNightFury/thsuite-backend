module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Drawer', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        deviceId: {
            type: DataTypes.UUID,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        closedAt: {
            type: DataTypes.DATE,
            allowNull:true
        },
        closedByUserId: {
            type: DataTypes.UUID,
            allowNull:true
        },
        startingAmount: {
            type: DataTypes.DECIMAL(8, 2)
        },
        userId: {
            type: DataTypes.UUID
        },
        notesForCloser: {
            type: DataTypes.STRING
        },
        endingAmount: {
            type: DataTypes.DECIMAL(8, 2)
        }

    }, {
        tableName: 'drawers',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Device, {
                    foreignKey: 'deviceId'
                });

                this.belongsTo(db.User, {
                    foreignKey: 'userId'
                });

                this.hasMany(db.Receipt, {
                    foreignKey: 'drawerId'
                });

                this.hasMany(db.DrawerRemoval, {
                    foreignKey: 'drawerId'
                })

                this.belongsTo(db.User, {
                    as:'ClosedByUser',
                    foreignKey:'closedByUserId'
                })
            }
        }
    });
};
