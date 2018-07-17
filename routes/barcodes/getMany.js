
const { BarcodeProductVariationItemPackage, Barcode, ProductVariation, Item, Package } = alias.require('@models');


module.exports = async function(barcodeIds) {

    let barcodes = await Barcode.findAll({
        where: {
            id: {
                $in: barcodeIds
            }
        },
        paranoid: false
    });

    return barcodes.map(barcode => barcode.get({plain: true}));

    // let formattedBarcodes = [];
    //
    // for(let barcode of barcodes){
    //     barcode = barcode.get({plain: true});
    //     barcode.ProductVariation = {
    //         id: barcode.BarcodeProductVariationItemPackages[0].ProductVariation.id
    //     };
    //     barcode.Items = [];
    //     barcode.Packages = [];
    //     for(let bpvip of barcode.BarcodeProductVariationItemPackages){
    //         barcode.Items.push({id: bpvip.Item.id});
    //         barcode.Packages.push({id: bpvip.Package.id});
    //     }
    //
    //     formattedBarcodes.push(barcode);
    //
    // }
    //
    // return formattedBarcodes;

    // let barcodeJoins = await BarcodeProductVariationItemPackage.findAll({
    //     where: {
    //         barcodeId: {
    //             $in: barcodeIds
    //         }
    //     },
    //     include: [
    //         {
    //             model: Barcode,
    //             attributes: ['id', 'barcode', 'allocatedInventory', 'remainingInventory', 'createdAt']
    //         },
    //         {
    //             model: ProductVariation,
    //             attributes: ['id']
    //         },
    //         {
    //             model: Item,
    //             attributes: ['id']
    //         },
    //         {
    //             model: Package,
    //             attributes: ['id']
    //         }
    //     ]
    // });
    //
    //
    // if(barcodeJoins.length) {
    //
    //     let barcodes = [];
    //
    //     for(let barcodeJoin of barcodeJoins){
    //
    //         let barcode = {};
    //
    //         barcode.id = barcodeJoin.Barcode.id;
    //         barcode.barcode = barcodeJoin.Barcode.barcode;
    //         barcode.allocatedInventory = barcodeJoin.Barcode.allocatedInventory;
    //         barcode.remainingInventory = barcodeJoin.Barcode.remainingInventory;
    //         barcode.createdAt = barcodeJoin.Barcode.createdAt;
    //
    //         barcode.ProductVariation = {
    //             id: barcodeJoin.ProductVariation.id
    //         };
    //
    //         barcode.Items = [];
    //         barcode.Packages = [];
    //
    //         let itemIds = [];
    //         let packageIds = [];
    //
    //         for (let row of barcodeJoins) {
    //
    //             let item = row.Item;
    //             let _package = row.Package;
    //
    //             if(itemIds.indexOf(item.id) == -1){
    //                 itemIds.push(item.id);
    //                 barcode.Items.push({id: item.id});
    //             }
    //
    //             if(packageIds.indexOf(_package.id) == -1){
    //                 packageIds.push(_package.id);
    //                 barcode.Packages.push({id: _package.id});
    //             }
    //
    //         }
    //
    //         barcodes.push(barcode);
    //     }
    //
    //
    //
    //     return barcodes;
    // }
};
