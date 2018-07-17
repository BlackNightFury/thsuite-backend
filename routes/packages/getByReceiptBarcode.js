const { Package, Receipt, Transaction } = alias.require('@models');

module.exports = async function(barcode) {

    const receipt = await Receipt.findOne({
        where: {
            barcode: barcode
        },
        include: [ {
            model: Transaction,
            limit: 1
        }]
    });

    if (receipt && receipt.Transactions && receipt.Transactions.length) {
        return receipt.Transactions[0].packageId;
    }

    return false;
};