
const { sequelize } = alias.require('@models');

module.exports = async function(args) {


    if(!args.startDate || !args.endDate) {
        console.log("Missing startDate or endDate");
        return [];
    }


    let query = `
        SELECT s.name, sum(t.totalPrice) as sum, sum(1) as count
        FROM suppliers s
        INNER JOIN packages p on p.supplierId = s.id
        INNER JOIN transactions t on
              t.packageId = p.id
          WHERE t.transactionDate BETWEEN :startDate AND :endDate
        GROUP BY s.name
    `;

    query += ' ORDER BY sum DESC';

    let isHomeDashboardData = false;
    if(args.limit) {
        isHomeDashboardData = true;
        query += ' LIMIT ' + args.limit;
    }

    let data = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            startDate: args.startDate,
            endDate: args.endDate
        }
    });

    if(!isHomeDashboardData) {
        let total = {
            name: 'Total',
            sum: 0,
            count: 0
        };

        for (let row of data) {
            total.sum += row['sum'];
            total.count += row['count'];
        }

        data.push(total);
    }

    return data;
};
