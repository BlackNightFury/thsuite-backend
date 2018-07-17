const { Receipt, LineItem, Barcode, Transaction, TransactionTax, Tax, Product, ProductVariation, Package, Item, User, sequelize } = alias.require('@models');
const moment = require('moment');

module.exports = async function({ packageId }){

    const receiptIds = await Transaction.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('receiptId')), 'receiptId']],
      where: { packageId }
    });

    const receipts = await Receipt.findAll({
        where: {
            id: {
              $in: receiptIds.map(r => r.toJSON().receiptId)
            }
        },
        include: [
            {
                model: LineItem,
                include: [
                    {
                        model: Barcode
                    },
                    {
                        model: Product,
                    },
                    {
                        model: ProductVariation,
                    },
                    {
                        model: Transaction,
                        include: [
                            {
                                model: Package,
                                include: [
                                    Item
                                ]
                            },
                            {
                                model: TransactionTax
                            }
                        ]
                    }
                ]
            },
            {
                model: User
            }
        ],
        order: [['createdAt', 'ASC']],
    });

    return receipts.map((r) => (r.toJSON()));
}
