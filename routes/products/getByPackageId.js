const {Package, Item, ProductVariation, ProductVariationItem, Product} = alias.require('@models');
module.exports = async function(packageId){

    let _package = await Package.findOne({
        where: {
            id: packageId
        },
        include: [
            {
                model: Item,
                include: [
                    {
                        model: ProductVariationItem,
                        include: [
                            {
                                model: ProductVariation,
                                include: [
                                    {
                                        model: Product,
                                        attributes: ['id']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    let productId = null;

    for(let pvi of _package.Item.ProductVariationItems){
        if(pvi.ProductVariation){
            productId = pvi.ProductVariation.Product.id;
            break;
        }
    }

    return productId;

}
