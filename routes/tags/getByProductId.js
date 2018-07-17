const { TagProduct } = alias.require('@models');
const moment = require('moment');

module.exports = async function({ productId }){

    return await TagProduct.findAll({
        attributes: [ 'tagId' ],
        where: { productId },
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .map( tagProduct => tagProduct.tagId )
}
