const { Package, Item, Product, ProductVariation, ProductVariationItem } = alias.require('@models');

module.exports = async function({packageId}){

    let _package = await Package.findOne( {
        include: [
            { model: Item, include: [
                { model: ProductVariationItem, include: [ { model: ProductVariation } ] },
                { model: Product }
            ] }
        ],
        where: { id: packageId }
    } )

    if(!_package || !_package.Item){
        return false;
    }

    if(_package.Item.UnitOfMeasureName === 'Each'){

        if(!_package.Item.ProductVariationItems.length){
            return false;
        }

        for(let pvi of _package.Item.ProductVariationItems){
            if(!pvi.ProductVariation || !pvi.ProductVariation.price){
                return false;
            }
        }

        return true;

    }else{
        return _package.Item.Product && _package.Item.Product.pricingTierId;
    }
};
