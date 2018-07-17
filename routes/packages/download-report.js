const {Package, Item, ProductVariationItem, ProductVariation, Product, ProductType, Supplier, sequelize } = alias.require('@models');
const uploadPdfToAws = alias.require('@lib/aws/uploadPdfToAws');
const uploadCSVToAws = alias.require('@lib/aws/uploadCSVToAws');

const Baby = require('babyparse');

module.exports = async function(args) {
    //args => { date: '2017-08-28T04:00:00Z', report: 'daily' }
    const moment = require('moment');

    let date = moment(args.date).format('YYYY-MM-DD 00:00:00');
    let packageIds = [];
    let data = null;

    //Only allow packages that satisfy args
    //Add includes to get all the way to product
    //If productId set, add to where for productInclude
    //If productTypeId set, add to where for productInclude
    //If supplierId set, add to where for packages
    let itemInclude = {
        model: Item,
        attributes: [],
        include: []
    };

    let productVariationItemInclude = {
        model: ProductVariationItem,
        attributes: [],
        include: []
    };

    let productVariationInclude = {
        model: ProductVariation,
        attributes: [],
        include: []
    };

    let productInclude = {
        model: Product,
        attributes: [],
        where: {}
    };

    let packageWhere = {};

    if(args.productId){
        productInclude.where.id = args.productId;
    }

    if(args.productTypeId){
        productInclude.where.productTypeId = args.productTypeId;
    }

    if(args.supplierId){
        packageWhere.supplierId = args.supplierId;
    }

    if(args.searchTerm){
        productInclude.where.name = {
            $like: '%' + args.searchTerm + '%'
        };
    }

    productVariationInclude.include.push(productInclude);
    productVariationItemInclude.include.push(productVariationInclude);
    itemInclude.include.push(productVariationItemInclude);


    let packages = await Package.findAll({
        attributes: ['id'],
        where: packageWhere,
        include: itemInclude
    });

    for(let _package of packages) {
        packageIds.push(_package.id);
    }

    if(packageIds.length) {
        //Query for init quantity
        let initQuantitySql = `
            SELECT id, wholesalePrice, ReceivedQuantity
            FROM packages
            WHERE id IN (?)
        `;

        let quantity = await
            sequelize.query(initQuantitySql, {
                replacements: [packageIds],
                type: sequelize.QueryTypes.SELECT
            });

        let initQuantity = 0;
        let initValue = 0;
        let unitPrices = {};
        for(let _package of quantity){
            initQuantity += _package.ReceivedQuantity;
            initValue += _package.wholesalePrice;
            if(_package.ReceivedQuantity){
                unitPrices[_package.id] = _package.wholesalePrice / _package.ReceivedQuantity;
            }else {
                unitPrices[_package.id] = 0;
            }
        }

        let soldPriorSql = `
            SELECT packageId, sum(QuantitySold) as sold
            FROM transactions
            WHERE packageId IN (?) AND transactionDate <= "${date}"
            GROUP BY packageId
        `;
        let sold = await
            sequelize.query(soldPriorSql, {
                replacements: [packageIds],
                type: sequelize.QueryTypes.SELECT,
            });

        let soldPriorQuantity = 0;
        let soldPriorValue = 0;

        for(let _package of sold) {
            soldPriorQuantity += _package.sold;
            soldPriorValue += (unitPrices[_package.packageId] * _package.sold);
        }

        let sales;
        //packages "wholesale price / recieve quantity"
        //productType -> name is Category and
        //productType -> cannabisCategory is type
        // finishedDate after this date
        // join Transfers and ReceivedDate before date
        //quantity recieved quantity - sum of quanitities for all trans before that date
        let soldDuringSql = `
            SELECT t.packageId, CONCAT(YEAR(t.transactionDate), '-', MONTH(t.transactionDate), '-', DAY(t.transactionDate)) as date, sum(t.QuantitySold) as sold,
            pt.name as type, pt.cannabisCategory, prod.name, p.Quantity, p.UnitOfMeasureName, p.wholesalePrice, p.ReceivedQuantity, sum(t.TotalPrice) as TotalPrice
            FROM transactions t
            INNER JOIN packages p ON p.id = t.packageId
            INNER JOIN products prod ON prod.id = t.productId
            INNER JOIN product_types pt ON pt.id = prod.productTypeId
            WHERE t.transactionDate <= "${date}"  AND t.packageId IN (?)
            GROUP BY YEAR(t.transactionDate), MONTH(t.transactionDate), DAY(t.transactionDate), packageId
        `;
        sales = await
            sequelize.query(soldDuringSql, {
                replacements: [packageIds],
                type: sequelize.QueryTypes.SELECT
            });

        for(let sale of sales) {
            //Get package ID, calc sold * unit price
            let valueSold = (unitPrices[sale.packageId] * sale.sold);
            sale.value = valueSold;
        }
        data = sales;
    } else {
        data = [];
    }

    //Generate csv

    let reportData = [];

    for(let row of data){
        let reportObj = {
            "Product Name": row.name,
            "Weight": (row.Quantity + " " + row.UnitOfMeasureName),
            "Category": row.type,
            "Quantity": row.sold,
            "Cost Per Unit": '$' + (row.wholesalePrice / row.ReceivedQuantity).toFixed(2),
            "Value Per Unit": '$' + (row.value / row.sold).toFixed(2),
            "Total Value":  '$' +  row.value.toFixed(2),
            "Potential Profit Per Unit": '$' + (row.TotalPrice / row.sold).toFixed(2),
            "Total Potential Profit": '$' + row.TotalPrice.toFixed(2)
        };

        reportData.push(reportObj);
    }

    let csv = Baby.unparse(reportData);

    const currentDate = moment().format('YYYYMMDDHHmmss');
    return await uploadCSVToAws(csv, "reports/inventoryBreakdown-" + currentDate +  ".csv");


};
