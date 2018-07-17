
const { Transaction } = alias.require('@models');


module.exports = async function(args) {

    let transactions = await Transaction.findAll({
        where: {
            receiptId: args.receiptId
        }
    });

    return transactions.map(t => t.id);
};