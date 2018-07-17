const uuid = require('uuid');

module.exports = [
    {
        id: '923abcea-1414-49a5-a538-e4650825fdf2',
        name: 'Bud Pricing Tier 1',
        description: 'Bud Pricing Tier 1',
        PricingTierWeights: [
            {
                id: uuid.v4(),
                weight: 1,
                price: 9
            },
            {
                id: uuid.v4(),
                weight: 3.5,
                price: 25 / 3.5
            },
            {
                id: uuid.v4(),
                weight: 7,
                price: 50 / 7
            },
            {
                id: uuid.v4(),
                weight: 14,
                price: 95 / 14
            },
            {
                id: uuid.v4(),
                weight: 28,
                price: 180 / 28
            },
        ]
    },
    {
        id: '24f9fada-138b-4019-be87-a91762998960',
        name: 'Bud Pricing Tier 2',
        description: 'Bud Pricing Tier 2',
        PricingTierWeights: [
            {
                id: uuid.v4(),
                weight: 1,
                price: 12
            },
            {
                id: uuid.v4(),
                weight: 3.5,
                price: 30 / 3.5
            },
            {
                id: uuid.v4(),
                weight: 7,
                price: 60 / 7
            },
            {
                id: uuid.v4(),
                weight: 14,
                price: 110 / 14
            },
            {
                id: uuid.v4(),
                weight: 28,
                price: 200 / 28
            },
        ]
    },
    {
        id: 'de2efcd3-3ccf-416f-a4f8-1fe27bc3a22e',
        name: 'Bud Pricing Tier 3',
        description: 'Bud Pricing Tier 3',
        PricingTierWeights: [
            {
                id: uuid.v4(),
                weight: 1,
                price: 13
            },
            {
                id: uuid.v4(),
                weight: 3.5,
                price: 35 / 3.5
            },
            {
                id: uuid.v4(),
                weight: 7,
                price: 70 / 7
            },
            {
                id: uuid.v4(),
                weight: 14,
                price: 130 / 14
            },
            {
                id: uuid.v4(),
                weight: 28,
                price: 240 / 28
            },
        ]
    },
    {
        id: 'e489f428-592f-4cd2-8770-4ba4653eb916',
        name: 'Bud Pricing Tier 4',
        description: 'Bud Pricing Tier 4',
        PricingTierWeights: [
            {
                id: uuid.v4(),
                weight: 1,
                price: 14
            },
            {
                id: uuid.v4(),
                weight: 3.5,
                price: 40 / 3.5
            },
            {
                id: uuid.v4(),
                weight: 7,
                price: 80 / 7
            },
            {
                id: uuid.v4(),
                weight: 14,
                price: 150 / 14
            },
            {
                id: uuid.v4(),
                weight: 28,
                price: 280 / 28
            },
        ]
    },
    {
        id: '56b08461-3495-46a0-a5b6-89e5c3bfccc3',
        name: 'Bud Pricing Tier 5',
        description: 'Bud Pricing Tier 5',
        PricingTierWeights: [
            {
                id: uuid.v4(),
                weight: 1,
                price: 15
            },
            {
                id: uuid.v4(),
                weight: 3.5,
                price: 45 / 3.5
            },
            {
                id: uuid.v4(),
                weight: 7,
                price: 90 / 7
            },
            {
                id: uuid.v4(),
                weight: 14,
                price: 160 / 14
            },
            {
                id: uuid.v4(),
                weight: 28,
                price: 300 / 28
            },
        ]
    }
];