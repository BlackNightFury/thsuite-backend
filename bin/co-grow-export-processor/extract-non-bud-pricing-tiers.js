const BabyParse = require('babyparse');
const {Package, PricingTier, PricingTierWeight, ProductType} = require('../../models');
const uuid = require('uuid');

function extractWeightInGrams(row) {

    if(/([\d.]+)g/i.exec(row.NAME)) {
        return /([\d.]+)g/i.exec(row.NAME)[1];
    }

    if(/([\d.])mg/i.exec(row.NAME)) {
        return /([\d.])mg/i.exec(row.NAME)[1] / 1000;
    }

    return 1;
}

function isPricingTiersEqual(tier1, tier2) {

    for(let weight of Object.keys(tier1)) {
        if(weight == 'id') {
            continue;
        }
        if(tier1[weight] != tier2[weight]) {
            return false;
        }
    }
    for(let weight of Object.keys(tier2)) {
        if(weight == 'id') {
            continue;
        }
        if(tier1[weight] != tier2[weight]) {
            return false;
        }
    }

    return true;
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

    let tiers = [];

    // let pricingTiers = await PricingTier.findAll({
    //     include: [
    //         PricingTierWeight
    //     ]
    // });
    //
    let tierCount = 1;
    // for(let tier of pricingTiers) {
    //     let weights = {};
    //     for(let weight of tier.PricingTierWeights) {
    //         weights[weight.weight] = weight.price;
    //     }
    //     weights.id = tier.id;
    //
    //     console.log(weights);
    //     tiers.push(weights);
    // }


    let budsProductType = await ProductType.findOne({
        where: {
            name: 'Buds'
        }
    });


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


        if(product.inventoryType == 'each') {
            continue;
        }
        if(product.productTypeId == budsProductType.id) {
            continue;
        }

        if(row.some(_package => extractWeightInGrams(_package))) {

            row.forEach(weight => {
                let grams = extractWeightInGrams(weight);

                weight.weight = grams
            });

            let weightTiers = {0: 0};

            for(let variationSize of row) {

                if(!variationSize.weight) {
                    continue;
                }

                weightTiers[variationSize.weight] = variationSize['SELL PRICE'];

            }

            let existingTier = tiers.find(isPricingTiersEqual.bind(this, weightTiers));

            if(existingTier) {
                product.pricingTierId = existingTier.id;
                console.log(`Found existing tier ${existingTier.id}`);
                await product.save();
            }
            else {

                let pricingTierWeights = [];
                for(let weight of Object.keys(weightTiers)) {
                    pricingTierWeights.push({
                        id: uuid.v4(),
                        weight: weight,
                        price: weightTiers[weight] / (weight == 0 ? 1 : weight)
                    })
                }

                let name = `Imported tier ${tierCount++}`;

                let existingTier = await PricingTier.create({
                    id: uuid.v4(),
                    name: name,
                    description: name,
                    PricingTierWeights: pricingTierWeights
                }, {
                    include: [PricingTierWeight]
                });

                weightTiers.id = existingTier.id;

                tiers.push(weightTiers);

                product.pricingTierId = weightTiers.id;
                await product.save();
                console.log(`New tier for ${label}: ${JSON.stringify(weightTiers)}`);
            }
        }
        else {
            console.log(`${row[0].NAME}`);
        }

    }

    console.log(tiers);

})();