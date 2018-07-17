const { TransactionTax } = alias.require('@models');


module.exports = async function(transactionId) {

    let transactionTaxes = await TransactionTax.findAll({
        where: {
            transactionId: transactionId
        }
    });

    return transactionTaxes.map(t => t.id);
};