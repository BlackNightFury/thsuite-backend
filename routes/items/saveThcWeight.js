const { Item } = alias.require('@models');

module.exports = async function({itemId, thcWeight}) {

    const existingItem = await Item.find({
        where: {
            id: itemId,
            //TODO clientId: req.user.clientId
        }
    });

    if(!existingItem) {
        return;
    }

    existingItem.version++;
    existingItem.thcWeight = thcWeight;

    await existingItem.save();

    return existingItem
};