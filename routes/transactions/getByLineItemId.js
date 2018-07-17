
const { Transaction } = alias.require('@models');


module.exports = async function(lineItemId) {

    let transactions = await Transaction.findAll({
        where: {
            lineItemId: lineItemId
        }
    });

    return transactions.map(t => t.id);
};