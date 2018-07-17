const { Alert, Barcode, Item, Package, Product, ProductVariation, Store, StoreSettings } = require('../../models');
const moment = require('moment')
const uuid = require('uuid/v4')
const sgMail = require('@sendgrid/mail')
const config = require('../../config');

sgMail.setApiKey(config.sendGrid);

module.exports = async () => {

    try {

        let stores = await Store.findAll( { include: [ StoreSettings ] } );

        await Promise.all( stores.map( async store => {

            const settings = store.StoreSetting,
                lowInventoryItems = [ ],
                lowBarcodeProducts = [ ];

            if( !settings ) return;

            if( settings.alertOnLowInventory ) {

                let storeItems = await Item.findAll( { include: [ Package ], where: { storeId: store.id } } );

                await Promise.all( storeItems.map( async item => {
                    if( !item.Packages ) return

                    const totalItemQuantity = item.Packages.reduce((sum,package) => sum + package.Quantity,0)
                    if( totalItemQuantity <= 0 ) return

                    const isLow = item.UnitOfMeasureName === 'Grams'
                            ? Boolean( totalItemQuantity < settings.lowInventoryGramThreshold || 0 )
                            : item.UnitOfMeasureName === 'Each'
                                ? Boolean(totalItemQuantity < settings.lowInventoryEachThreshold || 0)
                                : false

                    if( isLow ) {
                        await Alert.create( { id: uuid(), type: 'low-inventory', title: 'Order Inventory', description: `${item.name} is low (${totalItemQuantity}${item.UnitOfMeasureName === 'Grams' ? 'g' : ''}) and more should be ordered.` } )
                        lowInventoryItems.push( { name: item.name, totalItemQuantity, UnitOfMeasureName: item.UnitOfMeasureName } )
                    }
                } ) )

                if( lowInventoryItems.length && settings.lowInventoryEmailList.trim() ) {
                    const moreDivs = lowInventoryItems.map(item => `<div>${item.name} : ${item.totalItemQuantity}${item.UnitOfMeasureName === 'Grams' ? 'g' : ''} left.</div>`).join('')
                    const mailResult = await sgMail.send( {
                        to: settings.lowInventoryEmailList.trim().split(','),
                        from: 'noreply@thsuite.com',
                        subject: `Low Inventory Alert Summary`,
                        html: `<div>The following items are below the inventory alert threshold (${settings.lowInventoryGramThreshold} grams) or (${settings.lowInventoryEachThreshold} count):</div>${moreDivs}`
                    } )
                }
            }

            if( false && settings.alertOnLowBarcode ) {

                let storeProducts = await Product.findAll( { include: [ { model: ProductVariation, include: [ Barcode ] } ], where: { storeId: store.id } } )

                await Promise.all( storeProducts.map( async product => {
                    if( !product.ProductVariations ) return

                    const totalBarcodes =
                        product.ProductVariations.reduce((sum,productVariation) => {
                            if( !productVariation.Barcodes ) return sum
                            return productVariation.Barcodes.reduce((memo,barcode) => memo + barcode.remainingInventory,0)
                        }, 0 )

                    if( totalBarcodes < settings.lowBarcodeThreshold || 0 ) {
                        lowBarcodeProducts.push( { name: product.name, totalBarcodes } )
                        await Alert.create( { id: uuid(), type: 'low-barcode', title: 'Create Barcodes', description: `${product.name} is low on barcodes (${totalBarcodes}).` } )
                    }
                } ) )

                if( lowBarcodeProducts.length && settings.lowBarcodeEmailList.trim() ) {
                    const moreDivs = lowBarcodeProducts.map(product => `<div>${product.name} : ${product.totalBarcodes} left.</div>`).join('')
                    const mailResult = await sgMail.send( {
                        to: settings.lowBarcodeEmailList.trim().split(','),
                        from: 'noreply@thsuite.com',
                        subject: `Low Barcode Alert`,
                        html: `<div>The following products are below the barcode alert threshold of ${settings.lowBarcodeThreshold}.</div>${moreDivs}`
                    } )
                }
            }
        } ) )
    } catch( e ) {
        console.log(`There was a problem running the alert summary cron job: ${e.stack || e}`)
    }
}
