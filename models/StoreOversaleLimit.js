module.exports = function (sequelize, DataTypes) {
    return sequelize.define('StoreOversaleLimit', {
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
        storeId: {
            type: DataTypes.UUID,
        },
        cartMax: {
            type: DataTypes.DECIMAL(8, 3)
        },
        buds: {
            type: DataTypes.DECIMAL(8, 3)
        },
        shakeTrim: {
            type: DataTypes.DECIMAL(8, 3)
        },
        plants: {
            type: DataTypes.DECIMAL(8, 3)
        },
        infusedNonEdible: {
            type: DataTypes.DECIMAL(8, 3)
        },
        infusedEdible: {
            type: DataTypes.DECIMAL(8, 3)
        },
        concentrate: {
            type: DataTypes.DECIMAL(8, 3)
        }
    }, {
        tableName: 'store_oversale_limits',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Store, {
                    foreignKey: 'storeId'
                });
            }
        }
    })
}
