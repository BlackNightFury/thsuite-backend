'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Permission', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        clientId: {
            type: DataTypes.UUID
        },

        userId: {
            type: DataTypes.UUID
        },


        patientManagement: {
            type: DataTypes.ENUM,
            values: ['none', 'view', 'edit'],
            defaultValue: 'none'
        },
        canEditPatientGroups: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditPatients: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canAccessMedicalApp: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canAccessPhysiciansDashboard: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canAccessCaregiverDashboard: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canDoPatientCheck: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canReleaseBudtender: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canAccessVisitorDashboard: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },


        inventoryManagement: {
            type: DataTypes.ENUM,
            values: ['none', 'view', 'edit'],
            defaultValue: 'none'
        },
        canEditProducts: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditItems: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditProductTypes: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditSuppliers: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditBarcodes: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditPricingTiers: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditLineItems: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        storeManagement: {
            type: DataTypes.ENUM,
            values: ['none', 'view', 'edit'],
            defaultValue: 'none'
        },
        canEditStores: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditDiscounts: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditLoyaltyRewards: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditTaxes: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },


        reportsManagement: {
            type: DataTypes.ENUM,
            values: ['none', 'view', 'edit'],
            defaultValue: 'none'
        },


        employeeManagement: {
            type: DataTypes.ENUM,
            values: ['none', 'view', 'edit'],
            defaultValue: 'none'
        },

        canScanItems: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canManuallyAddCannabisItems: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canManuallyAddNonCannabisItems: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canVoidItems: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canAcceptReturns: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        canManuallyDiscount: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        canManuallyVerifyAge: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canAddNotesToPatient: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canRegisterDevice: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canSubmitToMetrc: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canPersistentLogin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        canEditStoreSettings: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        tableName: 'permissions',
        classMethods: {
            associate: function(db) {

            }
        }
    });
};
