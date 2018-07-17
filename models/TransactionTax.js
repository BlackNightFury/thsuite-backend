module.exports = function (sequelize, DataTypes) {
    return sequelize.define('TransactionTax', {
        id: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        transactionId: {
            type: DataTypes.UUID
        },
        taxId:{
            type: DataTypes.UUID
        },
        amount: {
            type: DataTypes.DECIMAL(8, 2)
        }
    }, {
        tableName: 'transaction_taxes',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.Transaction, {
                    foreignKey: 'transactionId'
                });

                this.belongsTo(db.Tax, {
                    foreignKey: 'taxId'
                })
            }
        }
    });
}