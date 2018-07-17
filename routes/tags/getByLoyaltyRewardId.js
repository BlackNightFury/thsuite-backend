const { LoyaltyRewardTag } = alias.require('@models');
const moment = require('moment');

module.exports = async function({loyaltyRewardId}){

    return await LoyaltyRewardTag.findAll({
        attributes: [ 'tagId' ],
        where: { loyaltyRewardId },
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .map( loyaltyRewardTag => loyaltyRewardTag.tagId )
}
