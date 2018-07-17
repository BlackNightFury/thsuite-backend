require("../../../init");
let models = require("../../../models/index");

const uuid = require('uuid');


module.exports = async function() {
    let user;

    user = await models.User.create({
        id: uuid.v4(),
        firstName: 'Admin',
        lastName: '',
        email: 'admin@thsuite.com',
        phone: '',
        licenseNumber: '',
        description: '',

        username: 'admin',
        password: models.User.hash('admin'),

        type: 'admin',
    });

    await user.createPermission();
    await user.createEmailSetting();

    user = await models.User.create({
        id: uuid.v4(),
        firstName: 'Budtender',
        lastName: '',
        email: 'pos@thsuite.com',
        phone: '',
        licenseNumber: '',
        description: '',

        username: 'pos',
        password: models.User.hash('pos'),

        type: 'pos',
    });

    await user.createPermission();
    await user.createEmailSetting();




    user = await models.User.create({
        id: '330d0ae7-8921-4eee-8ff9-3b697f2dcebc',
        version: 0,
        firstName: 'Default',
        lastName: 'User',
        email: 'zack@vimbly.com',
        phone: '',
        licenseNumber: '',

        pin: '0000',

        dob: new Date(),
        gender: "male",
        badgeId: "1234567890",
        badgeExpiration: new Date(),
        stateId: "1234567890",
        stateIdExpiration: new Date(),


        type: 'admin',
        status: 1,
        activation: null,
        image: null,

        isActive: true,
    });

    await user.createPermission({
        id: uuid.v4(),
        version: 0,

        clientId: '',

        userId: '',

        patientManagement: 'edit',
        canEditPatientGroups: true,
        canEditPatients: true,
        canAccessMedicalApp: true,
        canAccessPhysiciansDashboard: true,
        canAccessCaregiverDashboard: true,
        canAccessVisitorDashboard: true,
        canDoPatientCheck: true,
        canReleaseBudtender: true,


        inventoryManagement: 'edit',
        canEditProducts: true,
        canEditItems: true,
        canEditProductTypes: true,
        canEditSuppliers: true,
        canEditBarcodes: true,
        canEditPricingTiers: true,
        canEditLineItems: true,


        storeManagement: 'edit',
        canEditStores: true,
        canEditDiscounts: true,
        canEditLoyaltyRewards: true,
        canEditTaxes: true,


        reportsManagement: 'edit',
        employeeManagement: 'edit',

        canScanItems: true,
        canManuallyAddCannabisItems: true,
        canManuallyAddNonCannabisItems: true,
        canVoidItems: true,
        canAcceptReturns: true,

        canManuallyDiscount: true,

        canManuallyVerifyAge: true,
        canAddNotesToPatient: true
    });
    await user.createEmailSetting({
        id: uuid.v4(),
        version: 0,

        userId: '',

        lowInventory: true,
        autoClosedPackages: true,

        taxesReport: true
    });

}
