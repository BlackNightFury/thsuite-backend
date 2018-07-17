const {LineItem} = alias.require('@models');

module.exports = async function(receiptId){

    let lineItems = await LineItem.findAll({
        where: {
            receiptId: receiptId
        }
    });

    return lineItems.map(l => l.id);
};