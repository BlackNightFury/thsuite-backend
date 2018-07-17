require("../../../init");
let models = require("../../../models/index");

const uuid = require('uuid');


module.exports = async function() {

    await models.Discount.create({
        id: uuid.v4(),
        name: 'Discount 1',
        code: null,
        amountType: 'percent',
        amount: 5,
        minimumType: 'items',
        minimum: 1,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        days: '',
        productTypeId: null,
        productId: null,
        packageId: null,
        isActive: true,
        isCustom: false,
        isAutomatic: true
    });

    await models.Discount.create({
        id: uuid.v4(),
        name: 'Discount 2',
        code: null,
        amountType: 'dollar',
        amount: 5,
        minimumType: 'items',
        minimum: 1,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        days: '',
        productTypeId: null,
        productId: null,
        packageId: null,
        isActive: true,
        isCustom: false,
        isAutomatic: true
    });

}