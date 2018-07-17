const { Tag } = alias.require('@models');
const moment = require('moment');

module.exports = async function(data){

    return await Tags.findAll({
        where: { storeId: data.storeId },
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .map( tag => tag.id )
}
