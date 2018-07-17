require("../../../init");
let models = require("../../../models/index");

const uuid = require('uuid');

module.exports = async function(){
    await models.PricingTier.create({
        id: uuid.v4(),
        version: 0,
        name: "Basic Pricing Tier",
        description: "Base level pricing tier",
        PricingTierWeights: [
            {
                id: uuid.v4(),
                version: 0,
                weight: 0,
                price: 0,
                readOnly: 1
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 0.5,
                price: 10.00,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 1,
                price: 10.00,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 3.5,
                price: 9.50,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 7,
                price: 9.00,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 14,
                price: 8.25,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 28,
                price: 7.50,
                readOnly: 0
            },
        ]
    }, {
        include: [models.PricingTierWeight]
    });

    await models.PricingTier.create({
        id: uuid.v4(),
        version: 0,
        name: "Secondary Pricing Tier",
        description: "Secondary level pricing tier",
        PricingTierWeights: [
            {
                id: uuid.v4(),
                version: 0,
                weight: 0,
                price: 0,
                readOnly: 1
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 0.5,
                price: 12.00,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 1,
                price: 12.00,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 3.5,
                price: 11.00,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 7,
                price: 10.00,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 14,
                price: 8.75,
                readOnly: 0
            },
            {
                id: uuid.v4(),
                version: 0,
                weight: 28,
                price: 7.75,
                readOnly: 0
            },
        ]
    }, {
        include: [models.PricingTierWeight]
    });
};

if(require.main == module) {
    module.exports()
}
