const {Package, Item, ProductVariationItem, ProductVariation, Product, ProductType, Supplier, sequelize } = alias.require('@models');
const moment = require('moment');

module.exports = async function(args) {

    let date = moment(args.date).format('YYYY-MM-DD 00:00:00');
    let packageIds = [];
    let packageInclude = [];
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
        where: {},
        include: []
    };

    let productTypeInclude = {
        model: ProductType,
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

    if(args.cannabisFilter && args.cannabisFilter != 'all'){
        productTypeInclude.where.category = args.cannabisFilter;
    }

    productInclude.include.push(productTypeInclude);
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

        let quantity = await sequelize.query(initQuantitySql, {
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
            SELECT t.packageId, DATE(t.transactionDate) as date, sum(t.QuantitySold) as sold,
            pt.name as type, pt.category, prod.name, p.Label, p.Quantity, p.UnitOfMeasureName, p.wholesalePrice, p.ReceivedQuantity, sum(t.TotalPrice) as TotalPrice
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

        return sales;
    } else {
        return [];
    }


}
