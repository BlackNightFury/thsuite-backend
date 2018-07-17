module.exports = function(sequelize, DataTypes){
    return sequelize.define('PatientCaregiver', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        patientId: {
            type: DataTypes.UUID
        },
        caregiverId: {
            type: DataTypes.UUID
        }
    }, {
        tableName: 'patient_caregivers',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.Patient, {
                    foreignKey: 'patientId'
                });

                this.belongsTo(db.Caregiver, {
                    foreignKey: 'caregiverId'
                });
            }
        }
    })
}
