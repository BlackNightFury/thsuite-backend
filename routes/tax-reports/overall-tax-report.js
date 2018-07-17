const { Receipt, LineItem, Transaction, TransactionTax, Tax, Product, ProductVariation, sequelize } = alias.require('@models');
const moment = require('moment')
require('moment-timezone')
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils');

module.exports = async function(args){

    let sumTaxById = (object) => {

        let taxById = {};
        let iterables;
        if(object.Transactions){
            iterables = object.Transactions;
        }else{
            iterables = object.LineItems
        }

        for(let iterable of iterables){
            let iterableTaxById = iterable.taxById;
            Object.keys(iterableTaxById).forEach(taxId => {
                if(!taxById[taxId]){
                    taxById[taxId] = iterableTaxById[taxId];
                }else{
                    taxById[taxId] += iterableTaxById[taxId];
                }
            })
        }

        return taxById;

    };

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


    let receipts = await Receipt.findAll({
        attributes: ['id', 'barcode', 'paymentMethod', 'createdAt'],
        where: receiptWhere,
        include: [
            {
                model: LineItem,
                attributes: ['id'],
                include: [
                    {
                        model: Product,
                        attributes: ['name']
                    },
                    {
                        model: ProductVariation,
                        attributes: ['name']
                    },
                    {
                        model: Transaction,
                        attributes: ['id'],
                        include: [
                            {
                                model: TransactionTax,
                                attributes: ['taxId', 'amount']
                            }
                        ]
                    }
                ]
            }
        ]
    });

    receipts = receipts.map((r) => (r.toJSON()));

    for(let receipt of receipts){

        receipt.totalTax = 0;

        for(let lineItem of receipt.LineItems){

            lineItem.totalTax = 0;

            for(let transaction of lineItem.Transactions){

                transaction.totalTax = transaction.TransactionTaxes.reduce((sum, val) => {
                    return sum + val.amount;
                }, 0);

                let taxesById = {};

                transaction.TransactionTaxes.forEach(tax => {
                    taxesById[tax.taxId] = tax.amount;
                });

                transaction.taxById = taxesById;

                lineItem.totalTax += transaction.totalTax;
            }
            lineItem.taxById = sumTaxById(lineItem);
            receipt.totalTax += lineItem.totalTax;
        }
        receipt.taxById = sumTaxById(receipt);

    }

    //Add taxes that weren't included
    let taxes = await Tax.findAll({
        paranoid: false
    });

    for(let receipt of receipts){
        for(let tax of taxes){
            if(!receipt.taxById[tax.id]){
                receipt.taxById[tax.id] =  0;
            }
        }
    }

    if( args.export ) {
        let reportData = [];

        for(let row of receipts){
            row.LineItems.forEach( lineItem => {
                let reportObj = {
                    "ReceiptId": row.barcode,
                    "Transaction Date": moment.utc( row.createdAt ).tz(args.timeZone).format('ddd MMM D YYYY HH:mm:ss'),
                    "Payment Method": row.paymentMethod,
                    "Product Name": lineItem.Product.name,
                    "Total Tax": lineItem.totalTax,
                    
                };
             
                taxes.forEach( tax => reportObj[ `${tax.name} ( ${tax.percent}% )` ] = Utils.toDollarValue(lineItem.taxById[tax.id]) || 0 )
                
                reportObj[ "Total Tax" ] = Utils.toDollarValue(lineItem.totalTax)

                reportData.push(reportObj);
            })
        }

        let csv = Baby.unparse(reportData);

        return await uploadCSVToAws(csv, `reports/tax-export-${moment().format('YYYYMMDDHHmmss')}.csv`);

    } else {
        return receipts;
    }

}
