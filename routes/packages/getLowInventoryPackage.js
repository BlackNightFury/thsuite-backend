const { Package, BarcodeProductVariationItemPackage, ProductVariation, Item, Product, sequelize } = alias.require('@models');
const io = require('../../lib/io');

module.exports = async function(itemIds){

    // Check for low inventory only specific items
    if (itemIds && itemIds.length) {
        const emptyPackage = await sequelize.query(`
          SELECT p.id, SUM(p.Quantity) AS total_quantity
          FROM items i
          LEFT JOIN packages p ON (p.itemId = i.id)
          WHERE i.id IN(${',?'.repeat(itemIds.length).substr(1)})
          GROUP BY i.id
          HAVING total_quantity = 0
          LIMIT 1
        `, { type: sequelize.QueryTypes.SELECT, replacements: itemIds });

        if (emptyPackage && emptyPackage.length && emptyPackage[0].id) {
            const _package = await Package.findOne({
                include: [
                  // { model: BarcodeProductVariationItemPackage, include: [ { model: ProductVariation } ] },
                  { model: Item, required: true, include: [ { model: Product, required: true} ] },
                ],

                where: { id: emptyPackage[0].id }
            });

            if (_package) {
                io.of('/packages').emit('lowInventoryPackage', _package)
            }

            return _package;
        }
    }
}
