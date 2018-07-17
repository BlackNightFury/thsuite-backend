const { Receipt, Product, Tax, Transaction, TransactionTax } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils');

module.exports = async function( { paymentMethod, dateRange, timeZone } ) {

    const include = [ Product, { model: TransactionTax, include: [ Tax ] } ]

    include.push( { model: Receipt, where: paymentMethod !== 'all' ? { paymentMethod } : { } } )                            

    //TODO probably should chunk this up
    //TODO consider using raw: true
    let data = await Transaction.findAll({
        include,
        where: { createdAt: { $between: [ dateRange.startDate, dateRange.endDate ] } },
        order: [ 
            [ { model: Receipt }, 'barcode', 'DESC' ],
            [ 'transactionDate', 'DESC' ],
        ]
    });

    let reportData = [];

    for(let row of data){
        let reportObj = {
            "ReceiptId": row.Receipt.barcode,
            "Transaction Date": moment( row.transactionDate ).tz(timeZone).format('ddd MMM D YYYY HH:mm:ss'),
            "Payment Method": row.Receipt.paymentMethod,
            "Product Name": row.Product.name
        };
      
        let totalTax = 0  
        row.TransactionTaxes.forEach( transactionTax => {
            const taxedAmount = transactionTax.Tax.percent * row.TotalPrice
            totalTax += taxedAmount
            reportObj[ transactionTax.Tax.name ] = Utils.toDollarValue(taxedAmount)
        } )
        
        reportObj[ "Total Tax" ] = Utils.toDollarValue(totalTax)

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    return await uploadCSVToAws(csv, `reports/tax-export-${moment().format('YYYYMMDDHHmmss')}.csv`);
};
