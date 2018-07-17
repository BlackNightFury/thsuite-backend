const {Package, Adjustment, ReceiptAdjustment, Transaction, DeliveryPackage, Receipt, User, Supplier, Item} = alias.require('@models');
const moment = require('moment');

module.exports = async function(args) {

    if(!args.packageId) return;

    const _package = await Package.findOne({
        where: {
            id: args.packageId
        },
        include: [
            {
                model: Adjustment,
                include: [User]
            },
            //Receipt adjustments complicate package audit, hiding for now, may move to another report
            // {
            //     model: ReceiptAdjustment,
            //     include: [User, Receipt]
            // },
            {
                model: Transaction,
                include: [
                    {
                        model: Receipt,
                        include: [User]
                    }
                ],
                order: [['transactionDate', 'asc']]
            },
            {
                model: DeliveryPackage,
                include: [
                    {
                        model: Package,
                        include: [
                            {
                                model: Item,
                                include: [Supplier]
                            }
                        ]
                    }
                ]
            },
            {
                model: Item,
                attributes: [ 'name', 'UnitOfMeasureAbbreviation', 'supplierId' ],
            }
        ]
    });

    const name = _package.Item.name;
    const units = _package.Item.UnitOfMeasureAbbreviation;
    let supplierName = '';

    if ( _package.DeliveryPackage ) {
        supplierName = _package.DeliveryPackage.Package.Item.Supplier.name
    } else {
        const deliveryPackage = await DeliveryPackage.findOne( { where: { PackageLabel: _package.Label } } );
        _package.DeliveryPackage = deliveryPackage;

        const supplier = await Supplier.findOne( { attributes: ['id', 'name'], where: { id: _package.Item.supplierId } } );
        if (supplier) {
            supplierName = supplier.name;
        }
    }

    let changes = [];
    changes.push({
        date: _package.ReceivedDateTime,
        type: 'received',
        change: _package.ReceivedQuantity,
        notes: supplierName
    });

    if (_package.FinishedDate) {
        changes.push({
            date: _package.FinishedDate,
            type: 'finished',
            change: 0,
            notes: ''
        })
    }

    for (let adjustment of _package.Adjustments) {
        changes.push({
            date: adjustment.date,
            user: adjustment.User ? adjustment.User.firstName + ' ' + adjustment.User.lastName : '',
            type: 'adjustment',
            objectId: adjustment.id,
            change: adjustment.amount,
            notes: adjustment.reason + (adjustment.notes ? ': '+adjustment.notes : ''),
            adjustmentReason: adjustment.reason,
            adjustmentNotes: adjustment.notes
        })
    }

    //See above comment
    // for (let adjustment of _package.ReceiptAdjustments) {
    //     changes.push({
    //         date: adjustment.date,
    //         user: adjustment.User ? adjustment.User.firstName + ' ' + adjustment.User.lastName : '',
    //         type: 'receipt-adjustment',
    //         objectId: adjustment.id,
    //         change: adjustment.amount,
    //         notes: adjustment.reason + (adjustment.notes ? ': '+adjustment.notes : ''),
    //         receiptId: adjustment.receiptId,
    //         receiptBarcode: adjustment.Receipt.barcode,
    //         adjustmentReason: adjustment.reason,
    //         adjustmentNotes: adjustment.notes
    //     })
    // }

    for (let transaction of _package.Transactions) {
        changes.push({
            date: transaction.transactionDate,
            user: transaction.Receipt.User ? transaction.Receipt.User.firstName + ' ' + transaction.Receipt.User.lastName : '',
            type: 'transaction',
            objectId: transaction.id,
            change: (transaction.isReturn ? 1 : -1) * transaction.QuantitySold,
            notes: `${transaction.Receipt.barcode}${transaction.isReturn ? ' (RETURN)' : ''}`
        })

    }

    changes.sort((c1, c2) => {
        if (c1.date < c2.date) {
            return -1;
        } else if(c2.date < c1.date) {
            return 1
        } else {
            return 0
        }
    });

    let quantity = 0;
    for (let change of changes) {
        quantity += change.change;

        change.newQuantity = quantity.toFixed(2);
    }

    return { name, units, changes };
 }