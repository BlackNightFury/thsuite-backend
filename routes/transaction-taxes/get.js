const { TransactionTax } = alias.require('@models');


module.exports = async function(transactionTaxId) {

    let transactionTax = await TransactionTax.findOne({
        where: {
            id: transactionTaxId
        }
    });

    if(transactionTax){
        return transactionTax.get({plain: true})
    }
};