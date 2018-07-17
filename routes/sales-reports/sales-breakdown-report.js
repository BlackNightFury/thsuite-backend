const { Receipt, LineItem, Transaction, TransactionTax, Tax, Discount, Product, ProductVariation, Package, Item, User, sequelize } = alias.require('@models');
const moment = require('moment');

module.exports = async function(args){

    let dateRange = args.dateRange;
    let filters = args.filters;

    let receiptWhere = {
        createdAt: {
            $between: [
                dateRange.startDate,
                dateRange.endDate
            ]
        }
    };

    if(filters.paymentMethod && filters.paymentMethod !== 'all'){
        receiptWhere.paymentMethod = filters.paymentMethod;
    }

    if(filters.userId){
        receiptWhere.userId = filters.userId;
    }

    if(filters.searchTerm){
        receiptWhere.barcode = { $like: `%${filters.searchTerm}%` }
    }


    let receipts = await Receipt.findAll({
        where: receiptWhere,
        include: [
            {
                model: LineItem,
                include: [
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
                            },
                            {
                                model: Discount
                            }
                        ]
                    }
                ]
            },
            {
                model: User
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    return receipts.map((r) => (r.toJSON()));

}
