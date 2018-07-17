const models = alias.require('@models');
const Common = require('./common')
const { Product, Package, ProductType, Item, Barcode, BarcodeProductVariationItemPackage, sequelize } = models;

module.exports = async function(args) {

  if (args.advancedBarcodeSearch) {
      const limit = 12;
      const offset = (args.page || 0) * 12;

      let where = '';
      let replacements = {};

      if (args.query) {
          replacements.search = `%${args.query}%`;
          where = ` AND (
              \`Package\`.\`Label\` LIKE :search OR
              \`Item.Product\`.\`name\` LIKE :search OR
              \`BarcodeProductVariationItemPackages.Barcode\`.\`barcode\` LIKE :search
            )`
      }

      let order = [];
      if(args.sortBy && args.sortBy.sortBy) {
          order = args.sortBy.sortBy.split('.').map(part => models[part] || part);
          order.push(args.sortBy.direction);

          order = [order];
      }

      if (order.length) {
          order = 'ORDER BY '+order.map(row => `${row[0]} ${row[1]}`).join(', ');
      } else {
          order = ''
      }

      const sql = `SELECT
          \`Package\`.*,
          \`BarcodeProductVariationItemPackages\`.\`id\` AS \`BarcodeProductVariationItemPackages.id\`,
          \`BarcodeProductVariationItemPackages\`.\`barcodeId\` AS \`BarcodeProductVariationItemPackages.barcodeId\`,
          \`BarcodeProductVariationItemPackages\`.\`productVariationId\` AS \`BarcodeProductVariationItemPackages.productVariationId\`,
          \`BarcodeProductVariationItemPackages\`.\`itemId\` AS \`BarcodeProductVariationItemPackages.itemId\`,
          \`BarcodeProductVariationItemPackages\`.\`packageId\` AS \`BarcodeProductVariationItemPackages.packageId\`,
          \`BarcodeProductVariationItemPackages\`.\`createdAt\` AS \`BarcodeProductVariationItemPackages.createdAt\`,
          \`BarcodeProductVariationItemPackages\`.\`updatedAt\` AS \`BarcodeProductVariationItemPackages.updatedAt\`,
          \`BarcodeProductVariationItemPackages\`.\`deletedAt\` AS \`BarcodeProductVariationItemPackages.deletedAt\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`id\` AS \`BarcodeProductVariationItemPackages.Barcode.id\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`version\` AS \`BarcodeProductVariationItemPackages.Barcode.version\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`barcode\` AS \`BarcodeProductVariationItemPackages.Barcode.barcode\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`productVariationId\` AS \`BarcodeProductVariationItemPackages.Barcode.productVariationId\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`allocatedInventory\` AS \`BarcodeProductVariationItemPackages.Barcode.allocatedInventory\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`remainingInventory\` AS \`BarcodeProductVariationItemPackages.Barcode.remainingInventory\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`createdAt\` AS \`BarcodeProductVariationItemPackages.Barcode.createdAt\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`updatedAt\` AS \`BarcodeProductVariationItemPackages.Barcode.updatedAt\`,
          \`BarcodeProductVariationItemPackages.Barcode\`.\`deletedAt\` AS \`BarcodeProductVariationItemPackages.Barcode.deletedAt\`,
          \`Item\`.\`id\` AS \`Item.id\`,
          \`Item\`.\`storeId\` AS \`Item.storeId\`,
          \`Item\`.\`clientId\` AS \`Item.clientId\`,
          \`Item\`.\`version\` AS \`Item.version\`,
          \`Item\`.\`MetrcId\` AS \`Item.MetrcId\`,
          \`Item\`.\`name\` AS \`Item.name\`,
          \`Item\`.\`UnitOfMeasureName\` AS \`Item.UnitOfMeasureName\`,
          \`Item\`.\`UnitOfMeasureAbbreviation\` AS \`Item.UnitOfMeasureAbbreviation\`,
          \`Item\`.\`productTypeId\` AS \`Item.productTypeId\`,
          \`Item\`.\`strainId\` AS \`Item.strainId\`,
          \`Item\`.\`thcWeight\` AS \`Item.thcWeight\`,
          \`Item\`.\`createdAt\` AS \`Item.createdAt\`,
          \`Item\`.\`updatedAt\` AS \`Item.updatedAt\`,
          \`Item\`.\`deletedAt\` AS \`Item.deletedAt\`,
          \`Item\`.\`supplierId\` AS \`Item.supplierId\`,
          \`Item.Product\`.\`id\` AS \`Item.Product.id\`,
          \`Item.Product\`.\`storeId\` AS \`Item.Product.storeId\`,
          \`Item.Product\`.\`clientId\` AS \`Item.Product.clientId\`,
          \`Item.Product\`.\`version\` AS \`Item.Product.version\`,
          \`Item.Product\`.\`name\` AS \`Item.Product.name\`,
          \`Item.Product\`.\`description\` AS \`Item.Product.description\`,
          \`Item.Product\`.\`image\` AS \`Item.Product.image\`,
          \`Item.Product\`.\`inventoryType\` AS \`Item.Product.inventoryType\`,
          \`Item.Product\`.\`productTypeId\` AS \`Item.Product.productTypeId\`,
          \`Item.Product\`.\`itemId\` AS \`Item.Product.itemId\`,
          \`Item.Product\`.\`pricingTierId\` AS \`Item.Product.pricingTierId\`,
          \`Item.Product\`.\`eligibleForDiscount\` AS \`Item.Product.eligibleForDiscount\`,
          \`Item.Product\`.\`displayOnMenu\` AS \`Item.Product.displayOnMenu\`,
          \`Item.Product\`.\`createdAt\` AS \`Item.Product.createdAt\`,
          \`Item.Product\`.\`updatedAt\` AS \`Item.Product.updatedAt\`,
          \`Item.Product\`.\`deletedAt\` AS \`Item.Product.deletedAt\`
      FROM
          \`packages\` AS \`Package\`
              LEFT OUTER JOIN
          \`barcode_product_variation_item_packages\` AS \`BarcodeProductVariationItemPackages\` ON \`Package\`.\`id\` = \`BarcodeProductVariationItemPackages\`.\`packageId\` AND \`BarcodeProductVariationItemPackages\`.\`deletedAt\` IS NULL
              LEFT OUTER JOIN
          \`barcodes\` AS \`BarcodeProductVariationItemPackages.Barcode\` ON \`BarcodeProductVariationItemPackages\`.\`barcodeId\` = \`BarcodeProductVariationItemPackages.Barcode\`.\`id\` AND \`BarcodeProductVariationItemPackages.Barcode\`.\`deletedAt\` IS NULL
              LEFT OUTER JOIN
          \`items\` AS \`Item\` ON \`Package\`.\`itemId\` = \`Item\`.\`id\` AND \`Item\`.\`deletedAt\` IS NULL
              LEFT OUTER JOIN
          \`products\` AS \`Item.Product\` ON \`Item\`.\`id\` = \`Item.Product\`.\`itemId\` AND \`Item.Product\`.\`deletedAt\` IS NULL
      WHERE \`Package\`.\`deletedAt\` IS NULL ${where}
      ${order}
          LIMIT ${limit}
          OFFSET ${offset}
      `;

      const sqlCount = `SELECT
          COUNT(\`Package\`.\`id\`) AS \`count\`
      FROM
          \`packages\` AS \`Package\`
              LEFT OUTER JOIN
          \`barcode_product_variation_item_packages\` AS \`BarcodeProductVariationItemPackages\` ON \`Package\`.\`id\` = \`BarcodeProductVariationItemPackages\`.\`packageId\`
              AND \`BarcodeProductVariationItemPackages\`.\`deletedAt\` IS NULL
              LEFT OUTER JOIN
          \`barcodes\` AS \`BarcodeProductVariationItemPackages.Barcode\` ON \`BarcodeProductVariationItemPackages\`.\`barcodeId\` = \`BarcodeProductVariationItemPackages.Barcode\`.\`id\`
              AND \`BarcodeProductVariationItemPackages.Barcode\`.\`deletedAt\` IS NULL
              LEFT OUTER JOIN
          \`items\` AS \`Item\` ON \`Package\`.\`itemId\` = \`Item\`.\`id\`
              AND \`Item\`.\`deletedAt\` IS NULL
              LEFT OUTER JOIN
          \`products\` AS \`Item.Product\` ON \`Item\`.\`id\` = \`Item.Product\`.\`itemId\`
              AND \`Item.Product\`.\`deletedAt\` IS NULL
      WHERE
          \`Package\`.\`deletedAt\` IS NULL ${where}
          `;

      const rows = await sequelize.query(sql, {
          replacements: replacements,
          model: Package
          // , logging: console.log
      });

      let count = await sequelize.query( sqlCount, {
          replacements: replacements
          // , logging: console.log
      });
      count = count[0][0].count;

      return {
          objects: rows.map(p => p.get({plain: true})).map(p => p.id),
          numPages: Math.ceil(count / limit)
      }
    } else {
        return Common.handleSearch(args);
    }
}
