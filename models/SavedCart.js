
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('SavedCart', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        patientQueueId: {
            type: DataTypes.UUID
        },
        patientId: {
            type: DataTypes.UUID
        },
        cartData: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'saved_carts',
        classMethods: {
            associate: function(db) {

                this.belongsTo(db.PatientQueue, {
                    foreignKey: 'patientQueueId'
                });

                this.belongsTo(db.Patient, {
                    foreignKey: 'patientId'
                });
            }
        }
    });
};
