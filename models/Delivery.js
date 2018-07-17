module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Delivery', {
            id: {
                type: DataTypes.UUID,
                // defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },

            transferId: {
                type: DataTypes.UUID
            },

            MetrcId: {
                type: DataTypes.INTEGER
            },

            RecipientFacilityLicenseNumber: {
                type: DataTypes.STRING
            },

            RecipientFacilityName: {
                type: DataTypes.STRING
            },

            ShipmentType: {
                type: DataTypes.STRING
            },

            EstimatedDepartureDateTime: {
                type: DataTypes.DATE
            },

            EstimatedArrivalDateTime: {
                type: DataTypes.DATE
            },

            PlannedRoute: {
                type: DataTypes.STRING
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
        },
        {
            tableName: 'deliveries',
            classMethods: {
                associate: function (db) {
                    this.belongsTo(db.Transfer, {
                        foreignKey: 'transferId'
                    });
                    this.hasMany(db.DeliveryPackage, {
                        foreignKey: 'deliveryId'
                    })
                }
            }
        });
}
