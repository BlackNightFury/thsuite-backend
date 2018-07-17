const { Drawer, LineItem, Receipt, Store, Transaction, User, sequelize } = require('../../models');
const moment = require('moment')

const getEndingAmount = drawer => {
    if( !drawer.Receipts ) return drawer.startingAmount
    
    return drawer.Receipts.filter( receipt => receipt.paymentMethod === 'cash').reduce(
        ( endingAmount, receipt ) => {
            const receiptTotal = receipt.LineItems.reduce( ( total, lineItem ) => {
                let amount = lineItem.Transactions.reduce( ( lineItemTotal, transaction ) => lineItemTotal += transaction.TotalPrice, 0 )
                if( lineItem.isReturn === true ) amount = amount * -1;
                return total += amount
        	}, 0 )

            return endingAmount += receipt.amountPaid - receiptTotal
        }, drawer.startingAmount )
}

module.exports = ( async () => {
   
    try {
         
        let openDrawers = await Drawer.findAll( {
            include: [
                { model: Receipt, include: [
                    { model: LineItem, include: [ Transaction ] }
                ] },
                { model: User, include: [ Store ] }
            ],
            where: { endingAmount: null }
        } )

        await Promise.all( openDrawers.map( openDrawer => {
            const storeTimeZone = openDrawer.User.Store.timeZone
            if( moment.utc(openDrawer.createdAt).tz(storeTimeZone).date() !== moment().tz(storeTimeZone).date() ) {
                console.log(`updating drawer ${openDrawer.id} ${getEndingAmount(openDrawer)}`)
                return openDrawer.update( { endingAmount: getEndingAmount(openDrawer) }, { where: { id: openDrawer.id } } )
                .catch( e => console.log(`There was a problem running the auto-drawer-close cron job for Drawer id: ${openDrawer.id}: ${e.stack || e}`))
            } else { return Promise.resolve() }
        } ) )
    } catch( e ) { 
        console.log(`There was a problem running the auto-drawer-close cron job: ${e.stack || e}`)
    }
} )()
