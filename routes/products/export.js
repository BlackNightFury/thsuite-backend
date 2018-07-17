const { Item, Product, ProductType, ProductVariation, Supplier } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Utils = alias.require('@lib/Utils')

module.exports = async function( { supplierId, productTypeId } ) {

    const include = [
        productTypeId ? { model: ProductType, required: true, where: { id: productTypeId } } : ProductType,
        ProductVariation
    ]

    if( supplierId ) include.push( { model: Item, required: true, include: [ { model: Supplier, where: { id: supplierId } } ] } )

    //TODO probably should chunk this up
    //TODO consider using raw: true
    let data = await Product.findAll( { include } );

    let reportData = [];

    for(let row of data){
        let reportObj = {
            "Product Name": row.name,
            "Product Type": row.ProductType.name,
            "Description": row.description,
            "Inventory Type": row.inventoryType,
            "Eligible for Discount": row.eligibleForDiscount ? 'Yes' : 'No'
        };

        row.ProductVariations.forEach((productVariation,i) => {
            reportObj[ `Variation ${i+1}` ] = productVariation.name
        })

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const currentDate = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/products-export-" + currentDate +  ".csv");

};
