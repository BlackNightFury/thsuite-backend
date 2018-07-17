/* jshint indent: 2 */

//TODO: add constraints on email, phoneNumber
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Patient', {
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
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        patientType: {
            type: DataTypes.ENUM,
            values: ['recreational', 'medical']
        },
        patientGroupId: {
            type: DataTypes.UUID,
        },
        medicalStateId: {
            type: DataTypes.STRING
        },
        expirationDate: {
            type: DataTypes.DATEONLY
        },
        birthday: {
            type: DataTypes.DATEONLY
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        county: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        // patientNotes: {
        //     type: DataTypes.TEXT
        // },
        gramLimit: {
            type: DataTypes.DECIMAL(8, 3)
        },
        gramLimitUpdatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        loyaltyPoints: {
            type: DataTypes.INTEGER
        },
        otherStateId: {
            type: DataTypes.STRING
        },
        passportId: {
            type: DataTypes.STRING
        },
        driversLicenseId: {
            type: DataTypes.STRING
        },
        amountRemaining: {
            type: DataTypes.INTEGER
        },
        physicianId: {
            type: DataTypes.UUID
        },
        idImage: {
            type: DataTypes.STRING
        },
        attestationForm: {
            type: DataTypes.STRING
        },
        firstTimeInQueue: {
            type: DataTypes.DATE
        },
        lastAddedToQueue: {
            type: DataTypes.DATE
        },
        medicalCondition: {
            type: DataTypes.STRING
        },
        referrer: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'patients',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.PatientGroup, {
                    foreignKey: 'patientGroupId'
                });
                this.belongsTo(db.Physician, {
                    foreignKey: 'physicianId'
                });
                this.hasMany(db.PatientNote, {
                    foreignKey: 'patientId'
                });
                this.hasMany(db.PatientMedicalCondition, {
                    foreignKey: 'patientId'
                });
            },
        }
    });
};
