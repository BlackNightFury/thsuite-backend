/* jshint indent: 2 */

//TODO: add constraints on email, phoneNumber
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PatientQueue', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        patientId: {
            allowNull: false,
            type: DataTypes.UUID
        },
        caregiverId:{
            allowNull: true,
            type: DataTypes.UUID
        },
        cartOpen: {
            type: DataTypes.BOOLEAN,
        },
        budtenderId:{
            allowNull: true,
            type: DataTypes.UUID
        },
        source: {
            allowNull: true,
            type: DataTypes.STRING
        },
        verifiedAt: {
            type: DataTypes.DATE
        },
        enteredAt: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'patient_queue',
        classMethods: {
            associate: function(db) {
                this.belongsTo(db.Patient, {
                    foreignKey: 'patientId'
                })

                this.hasMany(db.SavedCart, {
                    foreignKey: 'patientQueueId'
                })
            },
        }
    });
};
