
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("PricingTier", {
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
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        mode: {
            type: DataTypes.ENUM,
            values: ['mix-match', 'matching-only', 'each']
        }
    }, {
        tableName: 'pricing_tiers',
        classMethods: {
            associate: function(db){
                this.hasMany(db.PricingTierWeight, {
                    foreignKey: 'pricingTierId'
                });
            }
        }
    });
};