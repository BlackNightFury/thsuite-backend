const { PurchaseOrder, Item, User, Package } = alias.require('@models');

module.exports = async function(itemId) {

    const item = await Item.findOne({
        where: {
            id: itemId
        },
        include: [
            {
                model: Package,
                attributes: [ 'id', 'ReceivedQuantity', 'wholesalePrice', 'ReceivedDateTime' ],
                order:[['date', 'ASC']]
            }
        ]
    });

    if (!item) return [];
    const name = item.get('name'),
        units = item.get('UnitOfMeasureAbbreviation');

    const adjustments = await PurchaseOrder.findAll({
        where: {
            itemId: itemId
        },
        include: [
            { 
                model: User,
                attributes: [ 'firstName', 'lastName' ],
            }
        ],
        order:[['date', 'ASC']]
    });

    let changes = [];

    changes = changes.concat(item.Packages.map(p => ({
        id:     p.id, 
        date:   p.ReceivedDateTime, 
        amount: item.Packages[0].ReceivedQuantity,
        user:   "", 
        price:  p.wholesalePrice,
        notes:  "Package Creation"
    })));

    changes = changes.concat(adjustments.map(a => ({
        id:     a.id, 
        date:   a.date, 
        amount: a.amount,
        user:   a.User && `${a.User.firstName} ${a.User.lastName}`, 
        price:  a.price,
        notes:  a.notes
    })))

    return { name, units, changes }
};