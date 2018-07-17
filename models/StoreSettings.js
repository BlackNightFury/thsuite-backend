/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('StoreSettings', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            field: 'id'
        },
        storeId: {
            type: DataTypes.UUID
        },
        version: {
            type: DataTypes.INTEGER(11),
            field: 'version',
            defaultValue: 0
        },
        cashManagement: {
            type: DataTypes.ENUM,
            values: [ 'one-drawer', 'shared-drawer-cashier-tracking', 'shared-drawer' ],
            defaultValue: 'one-drawer'
        },
        customerQueue: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        requireCustomerInformation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        verifyCustomerAge: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        belowCostWarning: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        autoPrintReceipts: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        combinePricingTiers: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        signOutAfterSale: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        signOutAfterInactivity: {
            type: DataTypes.ENUM,
            values: [ 'never', '1min', '5min', '15min', '1hr' ],
            defaultValue: 'never'
        },
        autoCloseLots: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        autoCloseLotsEmails: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        enableMedicalTransactions: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lowBarcodeThreshold: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 10
        },
        lowInventoryGramThreshold: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 40
        },
        lowInventoryEachThreshold: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 20
        },
        alertOnLowBarcode: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        alertOnLowInventory: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lowBarcodeEmailList: {
            type: DataTypes.TEXT
        },
        lowInventoryEmailList: {
            type: DataTypes.TEXT
        },
        dailySalesEmailList: {
            type: DataTypes.TEXT
        },
        enableDrawerLimit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        drawerAmountForAlert: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null
        }

    }, {
        tableName: 'store_settings',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Store, {
                    foreignKey: 'storeId'
                });
            }
        }
    });
};
