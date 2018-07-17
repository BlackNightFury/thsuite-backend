
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PackageUnusedLabel', {
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
        Label: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'package_unused_labels',
        classMethods: {
            associate: function(db) {
                this.hasOne(db.Package, {
                    foreignKey: 'Label',
                    targetKey: 'Label'
                });
            }
        }
    });
};
