require('../../../init');

const {Product, Transaction, ProductVariation, PricingTier, PricingTierWeight} = alias.require('@models');
const moment = require('moment');

module.exports = async function(){

    //This handles all post processing of data that is needed when using development/sandbox data from Metrc

    //Transaction dummy dates, discount IDs and amount, user IDs
    console.log("Setting dummy prices for products");

    let products = await Product.findAll({
        include: [Transaction, ProductVariation]
    });

    let pricingTiers = await PricingTier.findAll({
        include: [PricingTierWeight]
    });

    for(let product of products) {
        if(product.Transactions.length) {

            if(product.inventoryType == 'each') {
                product.ProductVariations[0].price = product.Transactions[0].TotalPrice / product.Transactions[0].QuantitySold;

                await product.ProductVariations[0].save();
            }else{

                if(pricingTiers.length) {
                    let pricingTier = pricingTiers[Math.floor(Math.random() * pricingTiers.length)];
                    product.pricingTierId = pricingTier.id;
                    await product.save();
                }

            }

        }
        else {
            console.log(`Product ${product.id} does not have any transactions`)
        }
    }
};