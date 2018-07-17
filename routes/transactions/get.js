
const { Transaction } = alias.require('@models');


module.exports = async function(transactionId) {

    let transaction = await Transaction.findOne({
        where: {
            id: transactionId
        }
    });

    return transaction.get({plain: true})
};