
const { Discount } = alias.require('@models');


module.exports = async function() {

    let discounts = await Discount.findAll({
        attributes: ['id'],
        where: {
            isCustom: false
        }
    });

    return discounts.map(p => p.id)
};