const { TransactionTax } = alias.require('@models');

const updateCommon = require('../common/update');

module.exports = updateCommon(TransactionTax, function(existingTransactionTax, transactionTax) {

    existingTransactionTax.id = transactionTax.id;
    existingTransactionTax.version = transactionTax.version;
    existingTransactionTax.transactionId = transactionTax.transactionId;

    existingTransactionTax.taxId = transactionTax.taxId;
    existingTransactionTax.amount = transactionTax.amount;


});