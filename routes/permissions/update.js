
const { Permission } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(Permission, function(existingPermission, permission) {

    existingPermission.patientManagement = permission.patientManagement;
    existingPermission.canEditPatientGroups = permission.canEditPatientGroups;
    existingPermission.canEditPatients = permission.canEditPatients;
    existingPermission.canAccessMedicalApp = permission.canAccessMedicalApp;
    existingPermission.canAccessPhysiciansDashboard = permission.canAccessPhysiciansDashboard;
    existingPermission.canAccessCaregiverDashboard = permission.canAccessCaregiverDashboard;
    existingPermission.canDoPatientCheck = permission.canDoPatientCheck;
    existingPermission.canReleaseBudtender = permission.canReleaseBudtender;
    existingPermission.canAccessVisitorDashboard = permission.canAccessVisitorDashboard;


    existingPermission.inventoryManagement = permission.inventoryManagement;
    existingPermission.canEditProducts = permission.canEditProducts;
    existingPermission.canEditItems = permission.canEditItems;
    existingPermission.canEditProductTypes = permission.canEditProductTypes;
    existingPermission.canEditSuppliers = permission.canEditSuppliers;
    existingPermission.canEditBarcodes = permission.canEditBarcodes;
    existingPermission.canEditPricingTiers = permission.canEditPricingTiers;
    existingPermission.canEditLineItems = permission.canEditLineItems;


    existingPermission.storeManagement = permission.storeManagement;
    existingPermission.canEditStores = permission.canEditStores;
    existingPermission.canEditDiscounts = permission.canEditDiscounts;
    existingPermission.canEditLoyaltyRewards = permission.canEditLoyaltyRewards;
    existingPermission.canEditTaxes = permission.canEditTaxes;


    existingPermission.reportsManagement = permission.reportsManagement;
    existingPermission.employeeManagement = permission.employeeManagement;


    existingPermission.canScanItems = permission.canScanItems;
    existingPermission.canManuallyAddCannabisItems = permission.canManuallyAddCannabisItems;
    existingPermission.canManuallyAddNonCannabisItems = permission.canManuallyAddNonCannabisItems;
    existingPermission.canVoidItems = permission.canVoidItems;
    existingPermission.canAcceptReturns = permission.canAcceptReturns;

    existingPermission.canManuallyDiscount = permission.canManuallyDiscount;

    existingPermission.canManuallyVerifyAge = permission.canManuallyVerifyAge;
    existingPermission.canAddNotesToPatient = permission.canAddNotesToPatient;

    existingPermission.canRegisterDevice = permission.canRegisterDevice;
    existingPermission.canSubmitToMetrc = permission.canSubmitToMetrc;

    existingPermission.canPersistentLogin = permission.canPersistentLogin;

    existingPermission.canEditStoreSettings = permission.canEditStoreSettings;
});
