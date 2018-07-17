const notAReturn = `( t.isReturn IS NULL OR t.isReturn IS FALSE )`

module.exports = class Common {

    static addTotal( data ) {
        let total = {
            type: 'Total',
            name: 'Total',
            amount: 0,
            count: 0,
            taxAmount: 0,
            totalPrice: 0,
            cogs: 0
        };

        for (let row of data) {
            total.amount += row.amount;
            total.count += row.count;
            total.totalPrice += row.totalPrice
            total.taxAmount += row.taxAmount
            total.cogs += row.cogs
        }

        data.push(total);
    }

    static get AggregateSelect() {
        return `` +
           `IFNULL(d.amount,0) as amount,
            IFNULL(d.taxAmount,0) as taxAmount,
            IFNULL(d.cogs,0) as cogs,
            IFNULL(d.TotalPrice,0) as totalPrice,
            IFNULL(d.count,0) as count`
    }

    static get AmountsSelect() {
        return `SUM(t.discountAmount) as amount, SUM(t.TotalPrice) as totalPrice, COUNT(1) as count, SUM(tax.amount) as taxAmount, SUM(package.unitPrice * t.QuantitySold) as cogs`
    }
    
    static get PackageAndTaxJoin() {
        return `LEFT JOIN ( SELECT transactionId, SUM(amount) as amount FROM transaction_taxes GROUP BY transactionId ) tax ON tax.transactionId = t.id 
                LEFT JOIN ( SELECT p.id, (p.wholesalePrice / p.ReceivedQuantity) as unitPrice FROM packages p ) package ON package.id = t.packageId`
    }
    
    static get Where() {
        return `WHERE t.discountAmount IS NOT NULL AND t.transactionDate BETWEEN :startDate AND :endDate AND ${notAReturn} AND t.deletedAt IS NULL`
    }

    static get OverallQuery() { return `
        SELECT d.name, ${this.AggregateSelect}
        FROM (
            SELECT d.name, ${this.AmountsSelect}
            FROM transactions t
            INNER JOIN discounts d ON
                t.discountId = d.id
            ${this.PackageAndTaxJoin} 
            ${this.Where}
            GROUP BY d.name
        ) d `
    }

    static get ByEmployeeQuery() { return `
        SELECT
            d.userId,
            d.first,
            d.last,
            ${this.AggregateSelect}
        FROM (
            SELECT u.id as userId, u.firstName as first, u.lastName as last, ${this.AmountsSelect}
            FROM receipts r
            INNER JOIN transactions t ON
                t.receiptId = r.id
            INNER JOIN discounts d ON
               t.discountId = d.id
            INNER JOIN users u ON
                r.userId = u.id
            ${this.PackageAndTaxJoin} 
            ${this.Where}
            GROUP BY u.id
        ) d `
    }

    static get ByNoneQuery() { return `
        SELECT
            'None' as type,
            d.name,
            ${this.AggregateSelect}
        FROM (
            SELECT p.name, ${this.AmountsSelect}
            FROM transactions t
            INNER JOIN products p ON
                t.productId = p.id
            INNER JOIN discounts d ON
                t.discountId = d.id
            ${this.PackageAndTaxJoin} 
            ${this.Where}
            GROUP BY p.name
        ) d`
    }

    static get ByPackageQuery() { return `
        SELECT
            'Package' as type,
            d.name,
            ${this.AggregateSelect}
        FROM (
            SELECT x.package as name, SUM(x.discountAmount) as amount, SUM(x.totalPrice) as totalPrice, count(1) as count, SUM(x.amount) as taxAmount, SUM(x.cogs) as cogs
            FROM
                (SELECT p.Label as package, t.discountAmount as discountAmount, t.totalPrice as totalPrice, tax.amount, ((p.wholesalePrice / p.ReceivedQuantity) * t.QuantitySold) as cogs
                FROM packages p
                INNER JOIN transactions t ON
                    t.packageId = p.id
                INNER JOIN discounts d ON
                    t.discountId = d.id
                LEFT JOIN ( SELECT transactionId, SUM(amount) as amount FROM transaction_taxes GROUP BY transactionId ) tax ON tax.transactionId = t.id 
                ${this.Where} AND d.packageId IS NOT NULL ) as x 
            GROUP BY x.package
        ) d`
    }

    static get ByProductQuery() { return `
        SELECT
            'Product' as type,
            d.name,
            ${this.AggregateSelect}
        FROM (
            SELECT x.product as name, SUM(x.discountAmount) as amount, SUM(x.totalPrice) as totalPrice, count(1) as count, SUM(x.amount) as taxAmount, SUM(x.cogs) as cogs
            FROM
                (SELECT p.name as product, t.discountAmount as discountAmount, t.totalPrice as totalPrice, tax.amount, (package.unitPrice * t.QuantitySold) as cogs
                FROM transactions t
                INNER JOIN discounts d ON
                    t.discountId = d.id
                INNER JOIN products as p ON
                    p.id = t.productId
                ${this.PackageAndTaxJoin} 
                ${this.Where} AND t.productId IS NOT NULL) as x 
            GROUP BY x.product
        ) d`
    }

    static get ByProductTypeQuery() { return `
        SELECT
            'Product Type' as type,
            d.name,
            ${this.AggregateSelect}
        FROM (
            SELECT x.productType as name, SUM(x.discountAmount) as amount, SUM(x.totalPrice) as totalPrice, count(1) as count, SUM(x.amount) as taxAmount, SUM(x.cogs) as cogs
            FROM
                (SELECT pt.name as productType, t.discountAmount as discountAmount, t.totalPrice as totalPrice, tax.amount, (package.unitPrice * t.QuantitySold) as cogs
                FROM transactions t
                INNER JOIN discounts d ON
                    t.discountId = d.id
                INNER JOIN products as p ON
                    p.id = t.productId
                INNER JOIN product_types as pt ON
                    pt.id = p.productTypeid
                ${this.PackageAndTaxJoin} 
                ${this.Where} AND t.productId IS NOT NULL ) as x 
            GROUP BY x.productType
        ) d`
    }
}
