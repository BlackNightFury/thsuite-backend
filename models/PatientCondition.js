'use strict';

module.exports = function(sequelize, DataTypes){
    return sequelize.define('PatientMedicalCondition', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        condition:{
            type: DataTypes.STRING
        },
        patientId:{
            type: DataTypes.UUID
        }
    }, {
        tableName: 'patient_conditions',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.Patient, {
                    foreignKey: 'patientId'
                });
            }
        }
    })
}
