const { LineItem } = alias.require('@models');
const updateCommon = require('../common/update');

module.exports = updateCommon(LineItem, async function(existingLineItem, lineItem) {

    const fields = [
        'productVariationId', 'productId', 'barcodeId',
    ];

    fields.forEach(field => {
        existingLineItem[field] = lineItem[field];
    })
});