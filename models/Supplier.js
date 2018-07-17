/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Supplier', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        clientId: {
            type: DataTypes.UUID,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        name: {
            type: DataTypes.STRING
        },
        licenseNumber: {
            type: DataTypes.STRING
        },
        streetAddress: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        contactName: {
            type: DataTypes.STRING
        }

    }, {
        tableName: 'suppliers',
        classMethods: {
            associate: function(db) {

                this.hasMany(db.Package, {
                    foreignKey: 'supplierId'
                });

            }
        }
    });
};
