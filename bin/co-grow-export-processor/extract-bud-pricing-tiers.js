const BabyParse = require('babyparse');
const {Package, PricingTier, PricingTierWeight, ProductType, Product} = require('../../models');
const uuid = require('uuid');

async function findOrCreateBudPricingTier() {

    let existing = await PricingTier.find({
        where: {
            id: '9ed2343a-6921-4d3c-8248-6cec9122f00f'
        },
        include: [
            PricingTierWeight
        ]
    });


    if(existing) {
        return existing;
    }


    return await PricingTier.create({
        id: '9ed2343a-6921-4d3c-8248-6cec9122f00f',
        name: 'Bud Pricing Tier',
        description: 'Bud Pricing Tier',
        PricingTierWeights: [
            {
                id: uuid.v4(),
                weight: 1,
                price: 20
            },
            {
                id: uuid.v4(),
                weight: 3.5,
                price: 60 / 3.5
            },
            {
                id: uuid.v4(),
                weight: 7,
                price: 110 / 7
            },
            {
                id: uuid.v4(),
                weight: 14,
                price: 200 / 14
            },
            {
                id: uuid.v4(),
                weight: 28,
                price: 360 / 28
            },
        ]
    }, {
        include: [PricingTierWeight]
    });
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

    let pricingTier = await findOrCreateBudPricingTier();


    let budsProductType = await ProductType.findOne({
        where: {
            name: 'Buds'
        }
    });

    await Product.update({
        pricingTierId: pricingTier.id
    }, {
        where: {
            productTypeId: budsProductType.id
        }
    });

})();