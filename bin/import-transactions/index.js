#!/usr/bin/env node

process.env.NODE_ENV="karing-kind"

const Alias = require('require-alias');
global.alias = new Alias({
    root: `${__dirname}/../..`,
    aliases: {
        '@root': '/',
        '@config': '/config',
        '@models': '/models',
        '@lib': '/lib'
    }
});

Object.defineProperties(String.prototype, {
    commify: {
        value: function(){
            return commaNumber(this);
        }
    },
    formatCurrency: {
        value: function(){
            let options = {format: '%s%v', code: 'USD', symbol: '$'};
            return formatCurrency(this, options);
        }
    },
    lpad: {
        value: function(padString, length){
            let str = this;
            while(str.length < length){
                str = padString + str;
            }

            return str;
        }
    }
});

const { ProductType, Item, Transaction, Product, Package, ProductVariation, ProductVariationItem, Receipt, LineItem, TransactionTax, Tax, Store, User, Patient } = require('../../models');

const Fs = require('fs')

const createBackendReceipt = require('../../routes/receipts/create'),
    uuid = require('uuid'),
    Utils = require('../../lib/Utils'),
    moment = require('moment')

require('moment-timezone')

const createLineItem = () => ( {
	id: uuid.v4(),
	version: 0,
	storeId: store.id,
	receiptId: '',
	productId: '',
	productVariationId: '',
	discountId: null,
	barcodeId: '',
	discountAmount: 0,
	quantity: 1,
	price: 0,
	Transactions: [],
	isReturn: false,
	returnedQuantity: 0,
	wasReturned: false
} )

const createTransaction = (lineItemId, packageId, productId, productVariationId, itemId) => ( {
    id: uuid.v4(),
    version: 0,
    storeId: store.id,
    receiptId: '',
    lineItemId,
    packageId,
    productId,
    productVariationId,
    itemId,
    QuantitySold: 0,
    TotalPrice: 0,
    TransactionTaxes: []
} )

const createReceipt = (userId,createdAt) => ( {
    id: uuid.v4(),
    version: 0,
    storeId: store.id,
    barcode: '',
    userId,
    patientId: '40c8afc2-8d22-4893-b51a-1299ef9e6cd0',
    paymentMethod: '',
    giftcardTransactionId: undefined,
    transactionTime: 0,
    amountPaid: 0,
    LineItems: [],
    createdAt
} )

const calculateTax = ( lineItem, cannabisOnly ) => {

	const type = lineItem.ProductVariation.Items[0].ProductType.category

	if( type != 'cannabis' && cannabisOnly ) return
	
    let taxes = cannabisOnly ? cannabisTaxes : allTaxes;
            
    taxes.forEach( tax => {
        const taxAmount = ( lineItem.price * ( tax.percent / 100 ) )
        lineItem.Transactions.forEach( transaction => {
            let transactionTax = {
                id: uuid.v4(),
                version: 0,
                transactionId: transaction.id,
                taxId: tax.id,
                amount: taxAmount
            }
            transaction.TransactionTaxes.push(transactionTax);
        }); 
    } )
}

let store = { }
let cannabisTaxes = []
let allTaxes = []
let receiptUser = { }

const lineItems = [ ]
const promises = [ ]

Promise.all( [
    Store.findAll({}).then( stores => Promise.resolve( store = stores[0] ) ),
    Tax.findAll({ where: { cannabisOnly: true } }).then( taxes => Promise.resolve( cannabisTaxes = taxes ) ),
    Tax.findAll({ where: { cannabisOnly: false } }).then( taxes => Promise.resolve( allTaxes = taxes ) ),
    User.findOne( { where: { firstName: 'Admin' } }).then( user => Promise.resolve( receiptUser = user ) )
] )
.then( () =>
    new Promise( resolve => { 

        const lineReader = require('readline').createInterface( {
          input: Fs.createReadStream( process.argv[2] )
        } )

        lineReader.on( 'line', line => {

            promises.push( new Promise( ( resolve, reject ) => {
                line = line.split(',')

                const createdAt = moment.tz( line[0], "MM/D/YYYY", store.timeZone ).format()

                Package.findOne( {
                    include: [ { model: Item,
                        include: [ { model: ProductType }, { model: ProductVariationItem, 
                            include: [ { model: ProductVariation,
                                include: [ { model: Product } ]
                             } ]
                        } ]
                    } ],
                    where: { Label: line[1] }
                } ).then( package => {

                    if( !package ) { return console.log(`Unable to find package: ${line[1]}`) }
                    if( !package.Item.ProductVariationItems || package.Item.ProductVariationItems.length === 0 ) {
                        console.log(`No ProductVariation for label: ${line[1]}`)
                    }

                    const lineItem = createLineItem(),
                        productVariation = package.Item.ProductVariationItems[0].ProductVariation
                    
                    productVariation.Items = [ package.Item ]

                    Object.assign( lineItem, {
                        barcodeId: null,
                        price: line[4],
                        productVariationId: productVariation.id,
                        ProductVariation: productVariation,
                        productId: productVariation.Product.id,
                        Product: productVariation.Product,
                        quantity: line[2],
                        createdAt
                    } ) 
                    
                    const transaction = createTransaction( lineItem.id, package.id, lineItem.productId, lineItem.productVariationId, package.Item.id )
                    Object.assign( transaction, {
                        Item: package.Item,
                        Product: lineItem.Product,
                        ProductVariation: productVariation,
                        TransactionTaxes: [],
                        createdAt,
                        packageId: package.id,
                        transactionDate: createdAt
                    } )
                    lineItem.Transactions = [ transaction ]

                    calculateTax( lineItem, true )
                    calculateTax( lineItem, false )
                        
                    lineItem.Transactions.forEach( transaction => {
                        transaction.TotalPrice = Number.parseFloat(line[4]) + transaction.TransactionTaxes.reduce( (sum,tax) => sum + tax.amount, 0 )
                    } )


                    lineItems.push(lineItem)

                    resolve()
                } )
            } ) )
        } )

        lineReader.on( 'close', () => {
            Promise.all( promises )
            .then( () => {
                const receipt = createReceipt(receiptUser.id,moment.tz( "12/1/2017", "MM/D/YYYY", store.timeZone ).format())

                receipt.LineItems = lineItems.map( lineItem => {
                    lineItem.receiptId = receipt.id;

                    const numTransactions = lineItem.Transactions.length;

                    lineItem.Transactions.forEach( transaction => {
                        transaction.receiptId = receipt.id

                        transaction.QuantitySold = (lineItem.quantity * lineItem.ProductVariation.quantity);

                        delete transaction.Item
                        delete transaction.Package
                        delete transaction.Product
                        delete transaction.ProductVariation
                    } )
                    
                    delete lineItem.Product
                    delete lineItem.ProductVariation

                    return lineItem
                } )
                
                return createBackendReceipt({receipt})
            } )
            .catch( console.log )
        } )

        
    } )
)
.catch( e => { console.log(e.stack || e); return Promise.resolve() } )
.then( () => process.exit(0) )
