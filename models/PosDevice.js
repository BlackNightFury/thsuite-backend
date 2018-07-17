
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PosDevice', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID
        }
    }, {
        tableName: 'pos_devices',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.User, {
                    foreignKey: 'userId'
                });
            }
        }
    })
}
