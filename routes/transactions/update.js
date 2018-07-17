const { Transaction, Package } = alias.require('@models');
const updateCommon = require('../common/update');

module.exports = updateCommon(Transaction, async function(existingTransaction, transaction) {

    const package_ = await Package.findOne({
        attributes: ['Label'],
        where: {
            id: transaction.packageId
        }
    });

    existingTransaction.packageId = transaction.packageId;
    existingTransaction.productId = transaction.productId;
    existingTransaction.productVariationId = transaction.productVariationId;
    existingTransaction.itemId = transaction.itemId;
    existingTransaction.PackageLabel = package_.Label;
});