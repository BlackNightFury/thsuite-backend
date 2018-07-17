const { Item, Package, ProductType, Store, Supplier } = alias.require('@models');
const moment = require('moment');
const Baby = require('babyparse');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');
const Common = require('./.Common');

const WeightUnitOfMeasures = require('../../utils/WeightUnitOfMeasures');

module.exports = async function( { supplierId, productTypeId, stock, measurementType } ) {

    const include = [ Package, Store ];

    include.push( Object.assign( { model: Supplier }, supplierId ? { required: true, where: { id: supplierId } } : { } ) );
    include.push( Object.assign( { model: ProductType }, productTypeId ? { required: true, where: { id: productTypeId } } : { } ) );

    // Setup

    let where = {};

    where = Common.AddStockClause( stock, where );

    if(measurementType && measurementType != 'all') {
        if (measurementType == 'each') where.UnitOfMeasureName = 'Each';
        else if (measurementType == 'weight') where.UnitOfMeasureName = {$in: WeightUnitOfMeasures};
    }
    console.log(where);

    let order = [['name', 'ASC']];

    // Querying

    let data = await Item.findAll( { include, where, order, logging: console.log } );

    let reportData = [];

    for(let row of data){
        const quantity = row.Packages.reduce( ( memo, package ) => memo + package.Quantity, 0 );
        let reportObj = {
            "Metrc ID": row.MetrcId ? row.MetrcId : 'N/A',
            "Item Name": row.name,
            "Product Type": row.ProductType.name,
            "Supplier": row.Supplier ? row.Supplier.name : '',
            "Measurement Type:": row.UnitOfMeasureName.trim() === 'Each' ? row.UnitOfMeasureName.trim() : 'Weight',
            "Quantity": `${quantity.toFixed(2)} ${row.UnitOfMeasureAbbreviation}`,
            "THC Weight (g)": row.thcWeight ? row.thcWeight : 'N/A'
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const currentDate = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/item-export-" + currentDate +  ".csv");

};
