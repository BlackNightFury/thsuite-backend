
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PricingTierWeight', {
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
        pricingTierId: {
            type: DataTypes.UUID
        },
        weight: {
            type: DataTypes.DECIMAL(8,3)
        },
        price: {
            type: DataTypes.DECIMAL(10,5)
        },
        readOnly: {
            type: DataTypes.INTEGER
        },
    }, {
        tableName: 'pricing_tier_weights',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.PricingTier, {
                    foreignKey: 'pricingTierId'
                })
            }
        }
    });
};