'use strict';

module.exports = function(sequelize, DataTypes){
    return sequelize.define('LoyaltyRewardTag', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        loyaltyRewardId:{
            type: DataTypes.UUID
        },
        tagId:{
            type: DataTypes.UUID
        }
    }, {
        tableName: 'loyalty_reward_tags',
        classMethods: {
            associate: function(db){
                this.belongsTo(db.Tag, {
                    foreignKey: 'tagId'
                });

                this.belongsTo(db.LoyaltyReward, {
                    foreignKey: 'loyaltyRewardId'
                });
            }
        }
    })
}
