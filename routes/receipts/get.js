const { Receipt, User } = alias.require('@models');

module.exports = async function(receiptId) {

    let receipt = await Receipt.findOne({
        // include: [ User ],
        where: {
            id: receiptId
        }
    });

    return receipt.get({plain: true})
};
