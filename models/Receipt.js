/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Receipt', {
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

        storeId: {
            type: DataTypes.UUID
        },
        barcode: {
            type: DataTypes.STRING
        },

        userId: {
            type: DataTypes.UUID
        },
        paymentMethod: {
            type: DataTypes.ENUM,
            values: ['cash', 'gift-card']
        },
        giftcardTransactionId: {
            type: DataTypes.STRING
        },
        drawerId: {
            type: DataTypes.UUID
        },
        transactionTime: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        patientId: {
            type: DataTypes.UUID
        },
        caregiverId: {
            type: DataTypes.UUID
        },
        amountPaid: {
            type: DataTypes.DECIMAL(8, 2)
        },
        voidNotes: {
            type: DataTypes.STRING
        },
    }, {
        tableName: 'receipts',
        classMethods: {
            associate: function(db) {
                this.hasMany(db.LineItem, {
                    foreignKey: 'receiptId'
                });
                this.hasMany(db.Transaction, {
                    foreignKey: 'receiptId'
                })
                this.belongsTo(db.User, {
                    foreignKey: 'userId'
                });
                this.belongsTo(db.Patient, {
                    foreignKey: 'patientId'
                });

                this.belongsTo(db.Caregiver, {
                    foreignKey: 'caregiverId'
                });

                this.belongsTo(db.Client, {
                    foreignKey: 'clientId'
                });

                this.belongsTo(db.Drawer, {
                    foreignKey: 'drawerId'
                });
            }
        }
    });
};
