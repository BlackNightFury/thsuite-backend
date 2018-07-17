const BabyParse = require('babyparse');
const {Package, PricingTier, PricingTierWeight, ProductType, Product} = require('../../models');
const uuid = require('uuid');


const budPricingTiers = require('./bud-pricing-tiers');



async function findOrCreateBudPricingTiers() {

    let tiers = [];

    for(let tier of budPricingTiers) {

        let existing = await PricingTier.find({
            where: {
                id: tier.id
            },
            include: [
                PricingTierWeight
            ]
        });

        if(existing) {
            tiers.push(existing);
        }
        else {
            tiers.push(
                await PricingTier.create(tier, {
                    include: [PricingTierWeight]
                })
            )
        }

    }

    return tiers;
}

(async function() {

    let {data, meta} = BabyParse.parseFiles('./barcode-export-clean.csv', {
        header: true
    });


    let labelWholesaleMap = Object.create(null);

    for(let row of data) {
        labelWholesaleMap[row.RFID] = labelWholesaleMap[row.RFID] || [];

        labelWholesaleMap[row.RFID].push(row);
    }

    let pricingTiers = await findOrCreateBudPricingTiers();

    let tiers = [];
    for(let tier of pricingTiers) {
        let weights = {};
        for(let weight of tier.PricingTierWeights) {
            weights[weight.weight] = weight.price;
        }
        weights.id = tier.id;

        console.log(weights);
        tiers.push(weights);
    }

    let budsProductType = await ProductType.findOne({
        where: {
            name: 'Buds'
        }
    });

    let missingPrices = [];


    for(let label of Object.keys(labelWholesaleMap)) {

        let row = labelWholesaleMap[label];

        let _package = await Package.findOne({
            where: {
                Label: label
            }
        });

        if(!_package) {
            console.log(`Could not find package for ${label}`);
            continue;
        }

        let item = await _package.getItem();
        let product = await item.getProduct();

        if(product.productTypeId != budsProductType.id) {
            continue;
        }

        let price = Math.round(row[0].Price.replace(/\$/g, ''));


        if(price == 0) {
            console.log('Package has no price');
            continue;
        }



        let pricingTier = tiers.find(tier => Math.round(tier['1']) == price || Math.round(tier['3.5'] * 3.5) == price);

        if(!pricingTier) {
            console.log(`Unknown tier for ${label}: ${row[0].Price}`);
            missingPrices.push(label);
            continue;
        }

        console.log(`${label}: ${row[0].Price} => ${pricingTier.id}`);

        product.pricingTierId = pricingTier.id;
        await product.save();

    }

    console.log();
    console.log();
    console.log();
    console.log('Missing prices');
    console.log(missingPrices);

})();