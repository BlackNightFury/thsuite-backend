/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Package', {
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

        storeId: {
            type: DataTypes.UUID
        },

        itemId: {
            type: DataTypes.UUID,
        },

        supplierId: {
            type: DataTypes.UUID,
            // allowNull: false TODO until metrc fixes the packages endpoint
        },

        wholesalePrice: {
            type: DataTypes.DECIMAL(8,2),
            allowNull: true
        },
        wholesaleNeedsVerify: {
            type: DataTypes.BOOLEAN
        },
        availableQuantity: {
            type: DataTypes.DECIMAL(8,3),
            allowNull: true
        },
        thcPercent: {
            type: DataTypes.DECIMAL(8,3),
            allowNull: true
        },
        cbdPercent: {
            type: DataTypes.DECIMAL(8,3),
            allowNull: true
        },
        strainType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ingredients: {
            type: DataTypes.STRING,
            allowNull: true
        },
        MetrcId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PackageType: {
            type: DataTypes.STRING
        },
        SourceHarvestNames: {
            type: DataTypes.STRING
        },
        Quantity: {
            type: DataTypes.DECIMAL(8, 3)
        },
        UnitOfMeasureName: {
            type: DataTypes.STRING
        },
        UnitOfMeasureAbbreviation: {
            type: DataTypes.STRING
        },
        PackagedDate: {
            type: DataTypes.DATEONLY
        },
        InitialLabTestingState: {
            type: DataTypes.STRING
        },
        LabTestingState: {
            type: DataTypes.STRING
        },
        LabTestingStateName: {
            type: DataTypes.STRING
        },
        LabTestingStateDate: {
            type: DataTypes.STRING
        },
        IsProductionBatch: {
            type: DataTypes.BOOLEAN
        },
        ProductionBatchNumber: {
            type: DataTypes.INTEGER
        },
        IsTestingSample: {
            type: DataTypes.BOOLEAN
        },
        IsProcessValidationTestingSample: {
            type: DataTypes.BOOLEAN
        },
        ProductRequiresRemediation: {
            type: DataTypes.BOOLEAN
        },
        ContainsRemediatedProduct: {
            type: DataTypes.BOOLEAN
        },
        RemediationDate: {
            type: DataTypes.DATEONLY
        },
        IsOnHold: {
            type: DataTypes.BOOLEAN
        },
        ArchivedDate: {
            type: DataTypes.DATE
        },
        FinishedDate: {
            type: DataTypes.DATE
        },
        LastModified: {
            type: DataTypes.DATE
        },

        ShippedQuantity: {
            type: DataTypes.DECIMAL(8, 3)
        },
        ReceivedQuantity: {
            type: DataTypes.DECIMAL(8, 3)
        },
        ReceivedDateTime:{
            type: DataTypes.DATE
        },
        ManifestNumber: {
            type: DataTypes.STRING
        },
        convertedFromPackageIds: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'packages',
        classMethods: {
            associate: function(db) {

                this.belongsTo(db.Item, {
                    foreignKey: 'itemId'
                });

                this.hasMany(db.Adjustment, {
                    foreignKey: 'packageId'
                });

                this.hasMany(db.PackagePriceAdjustment, {
                    foreignKey: 'packageId'
                });

                this.hasMany(db.PurchaseOrder, {
                    foreignKey: 'packageId'
                });

                this.hasMany(db.ReceiptAdjustment, {
                    foreignKey: 'packageId'
                });

                this.hasMany(db.Transaction, {
                    foreignKey: 'packageId'
                });

                this.hasOne(db.DeliveryPackage, {
                    foreignKey: 'packageId'
                });

                this.hasMany(db.BarcodeProductVariationItemPackage, {
                    foreignKey: 'packageId'
                });

                this.belongsTo(db.Supplier, {
                    foreignKey: 'supplierId'
                });

                this.belongsTo(db.PackageUnusedLabel, {
                    foreignKey: 'Label',
                    targetKey: 'Label'
                });

                this.hasOne(db.LabTestResult, {
                    foreignKey: 'packageId'
                });

            }
        },
        hooks: {
            afterSave: async function(_package, options) {
                const {Alert, Package} = sequelize.models;


                let totalItemQuantity = await Package.aggregate('Quantity', 'SUM', {
                    where: {
                        itemId: _package.itemId
                    },
                    transaction: options.transaction
                });

                if(totalItemQuantity > 20) { //TODO change hard coded value
                    await Alert.destroy({
                        where: {
                            type: 'item-low-inventory',
                            entityId: _package.itemId
                        },
                        transaction: options.transaction
                    });
                }
                else {

                    let item = await _package.getItem();

                    let [alert, created] = await Alert.findOrCreate({
                        where: {
                            type: 'item-low-inventory',
                            entityId: item.id
                        },
                        defaults: {
                            title: 'Low Item Inventory',
                            description: `Item ${item.name} has low inventory`,
                            url: `/admin/inventory/items/view/${item.id}`
                        },
                        transaction: options.transaction
                    });

                    //TODO send alert email if created
                }
            }
        }
    });
};
