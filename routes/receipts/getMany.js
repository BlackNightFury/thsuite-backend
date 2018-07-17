const { Receipt, Drawer, Device } = alias.require('@models');

module.exports = async function(receiptIds) {

    const receipts = await Receipt.findAll({
        include: [
            {
                model: Drawer,
                include: [
                    {
                        model: Device,
                    }
                ]
            }
        ],
        where: {
            id: {
                $in: receiptIds
            }
        }
    });

    return receipts.map(receipt => receipt.get({plain: true}));
};