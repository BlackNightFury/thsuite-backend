module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PatientNote', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        patientId: {
            type: DataTypes.UUID
        },
        authorId: {
            type: DataTypes.UUID
        },
        note: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'patient_notes',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Patient, {
                    foreignKey: 'patientId'
                });
            }
        }
    });
};
