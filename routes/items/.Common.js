const { sequelize } = alias.require('@models');

module.exports = class Common {

    static AddStockClause( stock, where ) {
        if( stock !== 'in' && stock !== 'out' ) return where;
        
        const existClause = stock === 'in'
            ? 'EXISTS'
            : 'NOT EXISTS';

        return sequelize.and(
            where,
            sequelize.literal(`
                ${existClause} (
                    SELECT packages.itemId
                    FROM packages
                    WHERE packages.itemId = Item.id AND packages.Quantity > 0
                )
            `)
        )
    }
}
