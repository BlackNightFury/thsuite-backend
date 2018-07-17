const { TagProductVariation } = alias.require('@models');
const moment = require('moment');

module.exports = async function(data){

    return await TagProductVariation.findAll({
        attributes: [ 'tagId' ],
        where: { productVariationId: data.productVariationId },
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .map( tagProductVariation => tagProductVariation.tagId )
}
