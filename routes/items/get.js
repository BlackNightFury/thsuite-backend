
const { Item } = alias.require('@models');


module.exports = async function(itemId) {

    let item = await Item.findOne({
        where: {
            id: itemId
        }
    });

    if(item) {

        return item.get({plain: true});
    }
};