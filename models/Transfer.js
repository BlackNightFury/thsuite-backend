/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Transfer', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.UUID
        },
        clientId: {
            type: DataTypes.UUID,
        },

        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        type: {
            type: DataTypes.ENUM('incoming', 'outgoing', 'rejected')
        },


        MetrcId: {
            type: DataTypes.INTEGER
        },

        ManifestNumber: {
            type: DataTypes.STRING
        },

        supplierId: {
            type: DataTypes.UUID,
            allowNull: false
        },

        DriverName: {
            type: DataTypes.STRING
        },
        DriverOccupationalLicenseNumber: {
            type: DataTypes.STRING
        },
        DriverVehicleLicenseNumber: {
            type: DataTypes.STRING
        },

        VehicleMake: {
            type: DataTypes.STRING
        },
        VehicleModel: {
            type: DataTypes.STRING
        },
        VehicleLicensePlateNumber: {
            type: DataTypes.STRING
        },

        DeliveryCount: {
            type: DataTypes.INTEGER
        },
        ReceivedDeliveryCount: {
            type: DataTypes.INTEGER
        },

        PackageCount: {
            type: DataTypes.INTEGER
        },
        ReceivedPackageCount: {
            type: DataTypes.INTEGER
        },

        CreatedDateTime: {
            type: DataTypes.DATE
        },
        CreatedByUserName: {
            type: DataTypes.STRING
        },
        LastModified: {
            type: DataTypes.DATE
        },

        MetrcDeliveryId: {
            type: DataTypes.INTEGER
        },

        EstimatedDepartureDateTime: {
            type: DataTypes.DATE
        },
        EstimatedArrivalDateTime: {
            type: DataTypes.DATE
        },

        DeliveryPackageCount: {
            type: DataTypes.INTEGER
        },
        DeliveryReceivedPackageCount: {
            type: DataTypes.INTEGER
        },

        ReceivedDateTime: {
            type: DataTypes.DATE
        }

    }, {
        tableName: 'transfers',
        classMethods: {
            associate: function(db) {
                this.hasMany(db.Delivery, {
                    foreignKey: 'transferId'
                });
                this.belongsTo(db.Supplier, {
                    foreignKey: 'supplierId'
                });
            }
        }
    });
};
