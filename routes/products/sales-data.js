
const { Product, sequelize } = alias.require('@models');

module.exports = async function(args) {

    let query = `
        SELECT i.id, i.name, sum(t.totalPrice) as sum, sum(1) as count
        FROM packages p
        INNER JOIN transactions t on
            t.packageId = p.id
        INNER JOIN items i ON
            p.itemId = i.id
        WHERE t.transactionDate BETWEEN :startDate AND :endDate
        ${args.searchQuery ? 'AND i.name LIKE :searchQuery' : ''}
        GROUP BY i.id, i.name
    `;

    if (args.mode !== undefined &&
        args.mode === 'best-seller') {
        query += ' ORDER BY sum DESC';
    }

    let isHomeDashboardData = false;

    if (args.limit !== undefined &&
            !isNaN(parseInt(args.limit)) &&
            parseInt(args.limit) > 0) {
        query += ' LIMIT ' + args.limit;
        isHomeDashboardData = true;
    }

    let replacements = {
        startDate: args.startDate,
        endDate: args.endDate
    };

    if (args.searchQuery) {
        replacements.searchQuery = `%${args.searchQuery}%`;
    }

    let data = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: replacements
    });

    if (!isHomeDashboardData) {
        let total = {
            name: 'Total',
            sum: 0,
            count: 0
        };

        //@todo query for total once data gets large
        for (let row of data) {
            total.sum += row['sum'];
            total.count += row['count'];
        }

        data.push(total);
    }

    return data;
};