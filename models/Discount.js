'use strict';

const crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Discount', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        clientId: {
            type: DataTypes.UUID
        },

        name: {
            type: DataTypes.STRING
        },
        code: { //DEPRECATED
            type: DataTypes.STRING
        },
        amountType: {
            type: DataTypes.ENUM,
            values: ['percent', 'dollar']
        },
        amount: {
            type: DataTypes.DECIMAL(8, 2)
        },

        minimumType: {
            type: DataTypes.ENUM,
            values: ['items', 'price']
        },
        minimum: {
            type: DataTypes.DECIMAL(8, 2)
        },

        maximum: {
            type: DataTypes.DECIMAL(8, 2),
        },

        startDate: {
            type: DataTypes.DATEONLY
        },
        endDate: {
            type: DataTypes.DATEONLY
        },

        startTime: {
            type: DataTypes.TIME
        },
        endTime: {
            type: DataTypes.TIME
        },

        days: {
            type: DataTypes.STRING
            //CSV of days mon,tue,wed,thu,fri,sat,sun
        },
        patientType:{
            type: DataTypes.ENUM,
            values: ['all', 'medical', 'recreational']
        },
        thcType:{
            type: DataTypes.ENUM,
            values: ['all', 'thc', 'non-thc']
        },
        patientGroupId: {
            type: DataTypes.UUID
        },

        productTypeId: {
            type: DataTypes.UUID
        },
        productId: {
            type: DataTypes.UUID
        },
        packageId: {
            type: DataTypes.UUID
        },
        lineItemId: {
            type: DataTypes.UUID
        },
        supplierId: {
            type: DataTypes.UUID
        },
        isActive: {
            type: DataTypes.BOOLEAN
        },
        isAutomatic: {
            type: DataTypes.BOOLEAN
        },
        isCustom: {
            type: DataTypes.BOOLEAN
        },
        isOverride: {
            type: DataTypes.BOOLEAN
        },
        managerApproval:{
            type: DataTypes.BOOLEAN
        },
        notes:{
            type: DataTypes.TEXT
        }

    }, {
        tableName: 'discounts',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.ProductType, {
                    foreignKey: 'productTypeId'
                });
                this.belongsTo(db.Product, {
                    foreignKey: 'productId'
                });
                this.belongsTo(db.Package, {
                    foreignKey: 'packageId'
                });
                this.belongsTo(db.Supplier, {
                    foreignKey: 'supplierId'
                });
            }
        }
    });
};
