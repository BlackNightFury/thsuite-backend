
const { BarcodeProductVariationItemPackage, Barcode, ProductVariation, Item, Package } = alias.require('@models');


module.exports = async function(barcodeId) {

    let barcodeJoins = await BarcodeProductVariationItemPackage.findAll({
        where: {
            barcodeId: barcodeId
        },
        include: [
            {
                model: Barcode,
                attributes: ['id', 'barcode', 'allocatedInventory', 'remainingInventory', 'createdAt']
            },
            {
                model: ProductVariation,
                attributes: ['id']
            },
            {
                model: Item,
                attributes: ['id']
            },
            {
                model: Package,
                attributes: ['id']
            }
        ]
    });


    if(barcodeJoins.length) {

        let barcode = {};

        barcode.id = barcodeId;
        
        if(barcodeJoins[0].Barcode) {
            barcode.barcode = barcodeJoins[0].Barcode.barcode;
            barcode.allocatedInventory = barcodeJoins[0].Barcode.allocatedInventory;
            barcode.remainingInventory = barcodeJoins[0].Barcode.remainingInventory;
            barcode.createdAt = barcodeJoins[0].Barcode.createdAt;
        }

        barcode.ProductVariation = {
            id: barcodeJoins[0].ProductVariation.id
        };

        barcode.Items = [];
        barcode.Packages = [];

        let itemIds = [];
        let packageIds = [];

        for (row of barcodeJoins) {

            let item = row.Item;
            let _package = row.Package;

            if(itemIds.indexOf(item.id) == -1){
                itemIds.push(item.id);
                barcode.Items.push({id: item.id});
            }

            if(packageIds.indexOf(_package.id) == -1){
                packageIds.push(_package.id);
                barcode.Packages.push({id: _package.id});
            }

        }


        return barcode;
    }
};
