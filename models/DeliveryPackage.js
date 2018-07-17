module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DeliveryPackage', {
            id: {
                type: DataTypes.UUID,
                // defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },

            deliveryId: {
                type: DataTypes.UUID
            },

            packageId: {
                type: DataTypes.UUID
            },

            MetrcPackageId: {
                type: DataTypes.INTEGER
            },

            PackageLabel: {
                type: DataTypes.STRING
            },

            SourceHarvestNames: {
                type: DataTypes.STRING
            },

            ProductName: {
                type: DataTypes.STRING
            },

            ProductCategoryName: {
                type: DataTypes.STRING
            },

            ShipmentPackageState: {
                type: DataTypes.STRING
            },

            ShippedQuantity: {
                type: DataTypes.DECIMAL(8, 3)
            },

            ShippedUnitOfMeasureName: {
                type: DataTypes.STRING
            },

            ReceivedQuantity: {
                type: DataTypes.DECIMAL(8, 3)
            },

            ReceivedUnitOfMeasureName: {
                type: DataTypes.STRING
            },

            ReceivedDateTime: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'delivery_packages',
            classMethods: {
                associate: function (db) {
                    this.belongsTo(db.Delivery, {
                        foreignKey: 'deliveryId'
                    });
                    this.belongsTo(db.Package, {
                        foreignKey: 'packageId'
                    });
                }
            }
        });
}