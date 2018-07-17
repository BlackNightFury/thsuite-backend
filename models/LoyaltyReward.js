'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LoyaltyReward', {
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
            type:DataTypes.STRING
        },
        points: {
            type: DataTypes.INTEGER
        },
        discountAmountType: {
            type: DataTypes.ENUM,
            values: ['percent', 'dollar']
        },
        discountAmount: {
            type: DataTypes.DECIMAL(8,2)
        },
        appliesTo: {
            type: DataTypes.ENUM,
            values: ['product', 'order']
        },
        numItems: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN
        }
    },{
        tableName: 'loyalty_rewards',
        classMethods: {
            associate: function(db){
                this.hasMany(db.LoyaltyRewardTag, {
                    foreignKey: 'loyaltyRewardId'
                });

                this.belongsToMany(db.Tag, {
                    foreignKey:'loyaltyRewardId',
                    otherKey: 'tagId',
                    through: {
                        model: db.LoyaltyRewardTag,
                        unique: false
                    }
                });
            }
        }
    });
};
